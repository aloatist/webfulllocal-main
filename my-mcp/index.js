import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCallback);

const workspaceRoot = process.env.PROJECT_ROOT
  ? path.resolve(process.env.PROJECT_ROOT)
  : process.cwd();

function resolvePath(inputPath = ".") {
  const candidate = path.resolve(workspaceRoot, inputPath);
  if (
    candidate !== workspaceRoot &&
    !candidate.startsWith(`${workspaceRoot}${path.sep}`)
  ) {
    throw new Error("Đường dẫn nằm ngoài workspace được phép.");
  }
  return candidate;
}

const server = new McpServer({
  name: "workspace-helper",
  version: "1.0.0",
});

server.registerTool(
  "list_directory",
  {
    description:
      "Liệt kê thư mục trong workspace để giúp AI hiểu cấu trúc project.",
    inputSchema: {
      path: z.string().trim().optional(),
      includeHidden: z.boolean().optional(),
    },
    outputSchema: {
      directory: z.string(),
      entries: z
        .array(
          z.object({
            name: z.string(),
            type: z.enum(["directory", "file", "other"]),
          })
        )
        .min(0),
    },
  },
  async ({ path: inputPath, includeHidden }) => {
    const targetPath = resolvePath(inputPath ?? ".");
    const dirEntries = await fs.readdir(targetPath, { withFileTypes: true });

    const entries = dirEntries
      .filter((entry) => {
        if (includeHidden) return true;
        return !entry.name.startsWith(".");
      })
      .map((entry) => ({
        name: entry.name,
        type: entry.isDirectory()
          ? "directory"
          : entry.isFile()
          ? "file"
          : "other",
      }));

    const relative = path.relative(workspaceRoot, targetPath) || ".";

    return {
      content: [
        {
          type: "text",
          text: `Danh sách thư mục tại ${relative}:\n${entries
            .map((entry) => `${entry.type.padEnd(9)} ${entry.name}`)
            .join("\n")}`,
        },
      ],
      structuredContent: {
        directory: relative,
        entries,
      },
    };
  }
);

const readFileInputSchema = {
  path: z.string().trim(),
  maxBytes: z.number().int().positive().max(5_000_000).optional(),
  encoding: z.string().trim().optional(),
};

server.registerTool(
  "read_file",
  {
    description: "Đọc nội dung file trong workspace với giới hạn kích thước.",
    inputSchema: readFileInputSchema,
    outputSchema: {
      path: z.string(),
      encoding: z.string(),
      truncated: z.boolean(),
      size: z.number(),
      content: z.string(),
    },
  },
  async ({ path: relativePath, maxBytes, encoding }) => {
    const filePath = resolvePath(relativePath);
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) {
      return {
        content: [
          {
            type: "text",
            text: `Đường dẫn ${relativePath} không phải file.`,
          },
        ],
        isError: true,
      };
    }

    const limit = maxBytes ?? 200_000;
    const selectedEncoding = encoding ?? "utf-8";

    const handle = await fs.open(filePath, "r");
    try {
      const buffer = Buffer.alloc(Math.min(limit, stat.size));
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      const content = buffer.toString(selectedEncoding, 0, bytesRead);
      const truncated = stat.size > bytesRead;

      return {
        content: [
          {
            type: "text",
            text: `Đọc file ${relativePath} thành công (truncated: ${truncated}).`,
          },
        ],
        structuredContent: {
          path: relativePath,
          encoding: selectedEncoding,
          truncated,
          size: stat.size,
          content,
        },
      };
    } finally {
      await handle.close();
    }
  }
);

server.registerTool(
  "run_command",
  {
    description:
      "Chạy lệnh shell trong workspace (mặc định thực thi tại root project).",
    inputSchema: {
      command: z.string().trim(),
      cwd: z.string().trim().optional(),
      timeoutMs: z.number().int().positive().max(120_000).optional(),
    },
    outputSchema: {
      command: z.string(),
      cwd: z.string(),
      stdout: z.string(),
      stderr: z.string(),
      exitCode: z.number(),
    },
  },
  async ({ command, cwd, timeoutMs }) => {
    const timeout = timeoutMs ?? 15_000;
    const workingDir = cwd ? resolvePath(cwd) : workspaceRoot;

    try {
      const { stdout, stderr } = await exec(command, {
        cwd: workingDir,
        timeout,
        maxBuffer: 1024 * 1024,
      });

      return {
        content: [
          {
            type: "text",
            text: `Lệnh "${command}" hoàn thành.`,
          },
        ],
        structuredContent: {
          command,
          cwd: path.relative(workspaceRoot, workingDir) || ".",
          stdout,
          stderr,
          exitCode: 0,
        },
      };
    } catch (error) {
      const execError = error;
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Lệnh "${command}" lỗi: ${
              execError.stderr || execError.message || "Không rõ nguyên nhân"
            }`,
          },
        ],
        structuredContent: {
          command,
          cwd: path.relative(workspaceRoot, workingDir) || ".",
          stdout: execError.stdout ?? "",
          stderr: execError.stderr ?? "",
          exitCode: typeof execError.code === "number" ? execError.code : -1,
        },
      };
    }
  }
);

server.registerTool(
  "internal_api_request",
  {
    description:
      "Gửi request tới API nội bộ thông qua HTTP(S). Có thể dùng biến môi trường INTERNAL_API_BASE_URL.",
    inputSchema: {
      path: z.string().trim().optional(),
      url: z.string().trim().optional(),
      method: z
        .string()
        .trim()
        .transform((value) => value.toUpperCase())
        .optional(),
      headers: z.record(z.string()).optional(),
      body: z.union([z.string(), z.record(z.any()), z.null()]).optional(),
      timeoutMs: z.number().int().positive().max(60_000).optional(),
    },
    outputSchema: {
      url: z.string(),
      status: z.number(),
      statusText: z.string(),
      headers: z.record(z.string()),
      body: z.string(),
    },
  },
  async ({ path: apiPath, url, method, headers, body, timeoutMs }) => {
    const baseUrl = process.env.INTERNAL_API_BASE_URL;
    const finalMethod = method ?? "GET";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs ?? 10_000);

    try {
      const targetUrl =
        url ??
        (() => {
          if (!baseUrl) {
            throw new Error(
              "Thiếu url đầy đủ hoặc INTERNAL_API_BASE_URL chưa được thiết lập."
            );
          }
          return new URL(apiPath ?? "/", baseUrl).toString();
        })();

      const requestHeaders = new Headers();
      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          requestHeaders.set(key, value);
        }
      }

      let requestBody;
      if (body !== undefined && body !== null) {
        if (typeof body === "object") {
          requestBody = JSON.stringify(body);
          if (!requestHeaders.has("content-type")) {
            requestHeaders.set("content-type", "application/json");
          }
        } else {
          requestBody = body;
        }
      }

      const response = await fetch(targetUrl, {
        method: finalMethod,
        headers: requestHeaders,
        body: requestBody,
        signal: controller.signal,
      });

      const text = await response.text();

      return {
        content: [
          {
            type: "text",
            text: `HTTP ${response.status} ${response.statusText} từ ${targetUrl}`,
          },
        ],
        structuredContent: {
          url: targetUrl,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: text,
        },
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Không thể gọi API: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    } finally {
      clearTimeout(timeout);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP workspace-helper server đã khởi động.");
}

main().catch((error) => {
  console.error("MCP server gặp lỗi:", error);
  process.exit(1);
});
