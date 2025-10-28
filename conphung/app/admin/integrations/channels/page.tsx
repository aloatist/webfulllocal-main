import { cookies } from "next/headers";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";
import clsx from "clsx";

async function getChannels() {
  noStore();
  return prisma.integrationChannel.findMany({
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      _count: true,
    },
  });
}

export default async function IntegrationChannelsPage() {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">
          {auth.error}
        </h1>
      </div>
    );
  }

  const channels = await getChannels();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Integration Channels
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi trạng thái kết nối và log đồng bộ từ n8n, OTA…
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {channels.length === 0 && (
          <p className="text-sm text-gray-500">
            Chưa có channel nào được ghi nhận.
          </p>
        )}
        {channels.map((channel) => (
          <Link
            key={channel.id}
            href={`/admin/integrations/channels/${channel.id}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {channel.provider} · {channel.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Endpoint: {channel.endpoint ?? "—"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Cập nhật cuối: {channel.updatedAt.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex flex-col items-end text-xs">
              <span
                className={clsx(
                  "inline-flex h-6 items-center rounded-full px-3 font-medium",
                  channel.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : channel.status === "ERROR"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700",
                )}
              >
                {channel.status}
              </span>
              <span className="mt-1 text-gray-500">
                {channel._count.ChannelSyncLog} log
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
