import {
  Prisma,
  IntegrationStatus,
  SyncDirection,
  SyncStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

type EnsureChannelArgs = {
  name: string;
  provider: string;
  endpoint?: string | null;
  config?: Record<string, unknown> | null;
  status?: IntegrationStatus;
};

type LogSyncEventArgs = {
  channelId: string;
  direction: SyncDirection;
  operation: string;
  status: SyncStatus;
  message?: string | null;
  payload?: unknown;
  markSynced?: boolean;
};

export async function ensureIntegrationChannel({
  name,
  provider,
  endpoint,
  config,
  status = IntegrationStatus.ACTIVE,
}: EnsureChannelArgs) {
  const jsonConfig =
    config === undefined
      ? undefined
      : (config as Prisma.InputJsonValue);

  const channel = await prisma.integrationChannel.upsert({
    where: {
      provider_name: {
        provider,
        name,
      },
    },
    update: {
      status,
      endpoint,
      config: jsonConfig,
      updatedAt: new Date(),
    },
    create: {
      id: nanoid(),
      name,
      provider,
      status,
      endpoint,
      config: jsonConfig,
      updatedAt: new Date(),
    },
  });

  return channel;
}

export async function logChannelSyncEvent({
  channelId,
  direction,
  operation,
  status,
  message,
  payload,
  markSynced = false,
}: LogSyncEventArgs) {
  const operations: Prisma.PrismaPromise<unknown>[] = [
    prisma.channelSyncLog.create({
      data: {
        id: nanoid(),
        channelId,
        direction,
        operation,
        status,
        message,
        payload:
          payload === undefined
            ? undefined
            : (payload as Prisma.InputJsonValue),
      },
    }),
  ];

  if (markSynced && status === SyncStatus.SUCCESS) {
    operations.push(
      prisma.integrationChannel.update({
        where: { id: channelId },
        data: { lastSyncedAt: new Date(), status: IntegrationStatus.ACTIVE },
      }),
    );
  } else if (status === SyncStatus.FAILED) {
    operations.push(
      prisma.integrationChannel.update({
        where: { id: channelId },
        data: { status: IntegrationStatus.ERROR },
      }),
    );
  }

  const results = (await prisma.$transaction(
    operations,
  )) as [
    Awaited<ReturnType<typeof prisma.channelSyncLog.create>>,
    ...unknown[],
  ];

  return results[0];
}

export async function recordSyncFailure(
  args: Omit<LogSyncEventArgs, "status">,
) {
  return logChannelSyncEvent({
    ...args,
    status: SyncStatus.FAILED,
  });
}

export async function recordSyncSuccess(
  args: Omit<LogSyncEventArgs, "status">,
) {
  return logChannelSyncEvent({
    ...args,
    status: SyncStatus.SUCCESS,
    markSynced: args.markSynced ?? true,
  });
}
