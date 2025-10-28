#!/usr/bin/env ts-node
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import {
  ensureIntegrationChannel,
  logChannelSyncEvent,
} from "@/lib/integrations/logger";
import { SyncDirection, SyncStatus } from "@prisma/client";

async function run() {
  const CHANNEL_NAME = "ota-sync";
  const CHANNEL_PROVIDER = "scheduler";

  const channel = await ensureIntegrationChannel({
    name: CHANNEL_NAME,
    provider: CHANNEL_PROVIDER,
    endpoint: "scripts/sync-homestay-availability",
  });

  const startWindow = subDays(new Date(), 1);

  const rooms = await prisma.homestayRoom.findMany({
    select: { id: true, slug: true, homestayId: true },
  });

  await logChannelSyncEvent({
    channelId: channel.id,
    direction: SyncDirection.OUTBOUND,
    operation: "ota-sync-start",
    status: SyncStatus.SUCCESS,
    payload: {
      roomCount: rooms.length,
      startWindow,
    },
    markSynced: false,
  });

  // TODO: Replace with actual OTA providers loop.
  // For each provider, fetch availability and update `HomestayAvailability` using
  // the admin API or Prisma client, then log success/failure with `logChannelSyncEvent`.

  await logChannelSyncEvent({
    channelId: channel.id,
    direction: SyncDirection.OUTBOUND,
    operation: "ota-sync-complete",
    status: SyncStatus.SUCCESS,
    payload: {
      message: "Placeholder job completed",
      roomsProcessed: rooms.length,
    },
    markSynced: true,
  });
}

run().catch(async (error) => {
  console.error("Failed to run sync script:", error);
  await logChannelSyncEvent({
    channelId: (
      await ensureIntegrationChannel({
        name: "ota-sync",
        provider: "scheduler",
      })
    ).id,
    direction: SyncDirection.OUTBOUND,
    operation: "ota-sync-error",
    status: SyncStatus.FAILED,
    message: error instanceof Error ? error.message : String(error),
    payload: { stack: error instanceof Error ? error.stack : undefined },
  });
  process.exit(1);
});
