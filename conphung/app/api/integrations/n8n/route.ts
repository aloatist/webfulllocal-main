import { NextResponse } from "next/server";
import { SyncDirection, SyncStatus } from "@prisma/client";
import {
  ensureIntegrationChannel,
  logChannelSyncEvent,
} from "@/lib/integrations/logger";

function isAuthorized(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) {
    return true;
  }

  const headerSecret =
    request.headers.get("x-n8n-secret") ??
    request.headers.get("x-webhook-secret") ??
    request.headers.get("authorization");

  if (!headerSecret) {
    return false;
  }

  if (headerSecret.startsWith("Bearer ")) {
    return headerSecret.replace("Bearer ", "") === secret;
  }

  return headerSecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => null)) ?? {};

    const operation =
      typeof payload.operation === "string"
        ? payload.operation
        : "n8n-webhook";

    const channel = await ensureIntegrationChannel({
      name: "n8n",
      provider: "n8n",
      endpoint: payload.endpoint ?? "webhook",
      config: {
        samplePayloadKeys: Object.keys(payload ?? {}),
      },
    });

    await logChannelSyncEvent({
      channelId: channel.id,
      direction: SyncDirection.INBOUND,
      operation,
      status: SyncStatus.SUCCESS,
      message:
        payload.message ??
        `Đồng bộ từ n8n lúc ${new Date().toISOString()}`,
      payload,
      markSynced: true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process n8n webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
