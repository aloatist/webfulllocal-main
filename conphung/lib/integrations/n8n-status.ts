type N8nHealthResponse = {
  status: string;
  version?: string;
  database?: {
    connected: boolean;
  };
  queue?: {
    running: boolean;
  };
};

export type N8nStatus = {
  ok: boolean;
  status: "online" | "offline" | "degraded";
  details?: Record<string, unknown>;
  error?: string;
};

function sanitizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function deriveStatusBaseFromWebhook(): string | null {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return null;
  }

  try {
    const parsed = new URL(webhookUrl);
    // Assume webhook path looks like /webhook/... → strip everything after /webhook
    const parts = parsed.pathname.split("/").filter(Boolean);
    const webhookIndex = parts.indexOf("webhook");
    if (webhookIndex >= 0) {
      parsed.pathname = parts.slice(0, webhookIndex).join("/");
    } else {
      parsed.pathname = "";
    }
    parsed.search = "";
    parsed.hash = "";
    return sanitizeBaseUrl(parsed.toString());
  } catch {
    return null;
  }
}

export async function fetchN8nStatus(): Promise<N8nStatus> {
  const configuredBase = process.env.N8N_STATUS_API_URL;
  const derivedBase = configuredBase ?? deriveStatusBaseFromWebhook();

  if (!derivedBase) {
    return {
      ok: false,
      status: "degraded",
      error: "Chưa cấu hình N8N_STATUS_API_URL hoặc N8N_WEBHOOK_URL",
    };
  }

  const restBase = derivedBase.endsWith("/rest")
    ? sanitizeBaseUrl(derivedBase)
    : `${sanitizeBaseUrl(derivedBase)}/rest`;
  const url = `${restBase}/health`;
  const secret = process.env.N8N_WEBHOOK_SECRET;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      // Avoid caching to always get fresh health
      cache: "no-store",
    });

    if (!response.ok) {
      const fallbackStatus =
        response.status === 404
          ? "degraded"
          : "offline";

      return {
        ok: false,
        status: fallbackStatus,
        error: `Health endpoint trả về ${response.status}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as N8nHealthResponse;
    const databaseHealthy = data.database?.connected ?? false;
    const queueRunning = data.queue?.running ?? false;

    const isHealthy =
      response.ok && databaseHealthy && queueRunning && data.status !== "errored";

    return {
      ok: isHealthy,
      status: isHealthy ? "online" : "degraded",
      details: {
        ...data,
        checkedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      ok: false,
      status: "offline",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
