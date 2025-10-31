import { subDays } from "date-fns";
import { Prisma, SyncStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchN8nStatus, N8nStatus } from "./n8n-status";

const N8N_PROVIDER = "n8n";

export type N8nChannelSummary = Awaited<
  ReturnType<typeof prisma.integrationChannel.findMany>
>[number] & { logCount?: number };

export type N8nLogEntry = Awaited<
  ReturnType<typeof prisma.channelSyncLog.findMany>
>[number];

export type N8nMetrics = {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  lastEventAt?: string;
};

export type N8nDashboardData = {
  channels: (N8nChannelSummary & { lastLog?: string })[];
  logs: N8nLogEntry[];
  metrics: N8nMetrics;
  status: N8nStatus;
};

export async function getN8nDashboardData(): Promise<N8nDashboardData> {
  const since = subDays(new Date(), 7);

  const [channels, logs, successCount, failureCount, totalLogs, lastEvent, status] =
    await Promise.all([
      prisma.integrationChannel.findMany({
        where: { provider: N8N_PROVIDER },
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: { ChannelSyncLog: true },
          },
        },
      }),
      prisma.channelSyncLog.findMany({
        where: { IntegrationChannel: { provider: N8N_PROVIDER } },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.channelSyncLog.count({
        where: {
          status: SyncStatus.SUCCESS,
          createdAt: { gte: since },
          IntegrationChannel: { provider: N8N_PROVIDER },
        },
      }),
      prisma.channelSyncLog.count({
        where: {
          status: SyncStatus.FAILED,
          createdAt: { gte: since },
          IntegrationChannel: { provider: N8N_PROVIDER },
        },
      }),
      prisma.channelSyncLog.count({
        where: { IntegrationChannel: { provider: N8N_PROVIDER } },
      }),
      prisma.channelSyncLog.findFirst({
        where: { IntegrationChannel: { provider: N8N_PROVIDER } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      fetchN8nStatus(),
    ]);

  const successRate =
    successCount + failureCount === 0
      ? 100
      : Math.round((successCount / (successCount + failureCount)) * 100);

  return {
    channels: channels.map((channel) => ({
      ...channel,
      logCount: channel._count.ChannelSyncLog,
      lastLog: logs.find((log) => log.channelId === channel.id)?.createdAt?.toISOString(),
    })),
    logs,
    metrics: {
      totalLogs,
      successCount,
      failureCount,
      successRate,
      lastEventAt: lastEvent?.createdAt?.toISOString(),
    },
    status,
  };
}
