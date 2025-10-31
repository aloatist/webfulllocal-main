import { SyncDirection, SyncStatus } from "@prisma/client";
import {
  ensureIntegrationChannel,
  logChannelSyncEvent,
} from "@/lib/integrations/logger";

const CHANNEL_NAME = "n8n";
const CHANNEL_PROVIDER = "n8n";

type SendN8nOptions = {
  webhookUrl?: string;
  context?: Record<string, unknown>;
};

export async function sendN8nEvent(
  operation: string,
  payload: Record<string, unknown>,
  options: SendN8nOptions = {},
) {
  const webhookUrl = options.webhookUrl ?? process.env.N8N_WEBHOOK_URL;

  const channel = await ensureIntegrationChannel({
    name: CHANNEL_NAME,
    provider: CHANNEL_PROVIDER,
    endpoint: webhookUrl ?? "unset",
    config: options.context,
  });

  if (!webhookUrl) {
    await logChannelSyncEvent({
      channelId: channel.id,
      direction: SyncDirection.OUTBOUND,
      operation,
      status: SyncStatus.FAILED,
      message: "N8N_WEBHOOK_URL chưa được cấu hình",
      payload,
    });
    return { ok: false, reason: "MISSING_WEBHOOK_URL" as const };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        operation,
        metadata: {
          triggeredAt: new Date().toISOString(),
          source: "admin-panel",
          ...options.context,
        },
        ...payload,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      await logChannelSyncEvent({
        channelId: channel.id,
        direction: SyncDirection.OUTBOUND,
        operation,
        status: SyncStatus.FAILED,
        message: `Webhook trả về ${response.status}`,
        payload: { payload, response: text },
      });
      return { ok: false, reason: "REMOTE_ERROR" as const, status: response.status };
    }

    const data = await response.json().catch(() => ({}));
    await logChannelSyncEvent({
      channelId: channel.id,
      direction: SyncDirection.OUTBOUND,
      operation,
      status: SyncStatus.SUCCESS,
      payload: { payload, response: data },
      markSynced: true,
    });

    return { ok: true as const, data };
  } catch (error) {
    await logChannelSyncEvent({
      channelId: channel.id,
      direction: SyncDirection.OUTBOUND,
      operation,
      status: SyncStatus.FAILED,
      message: (error as Error).message,
      payload,
    });
    return { ok: false, reason: "NETWORK_ERROR" as const };
  }
}
