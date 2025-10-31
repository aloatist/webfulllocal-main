import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";
import { sendN8nEvent } from "@/lib/integrations/n8n-client";

function isJsonRecord(value: Prisma.JsonValue | null): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

export async function POST(
  request: Request,
  context: { params: { logId: string } },
) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { logId } = context.params;

  const log = await prisma.channelSyncLog.findUnique({
    where: { id: logId },
    include: {
      IntegrationChannel: true,
    },
  });

  if (!log) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }

  if (!isJsonRecord(log.payload)) {
    return NextResponse.json(
      { error: "Payload không phù hợp để gửi lại" },
      { status: 400 },
    );
  }

  const webhookUrl = isHttpUrl(log.IntegrationChannel.endpoint)
    ? log.IntegrationChannel.endpoint
    : undefined;

  try {
    const result = await sendN8nEvent(
      `${log.operation}-retry`,
      {
        ...log.payload,
        retryFromLogId: log.id,
        retriedAt: new Date().toISOString(),
      },
      {
        webhookUrl,
        context: {
          trigger: "admin-retry",
          userId: auth.user.id,
          originalOperation: log.operation,
        },
      },
    );

    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (error) {
    console.error("Failed to retry n8n log:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
