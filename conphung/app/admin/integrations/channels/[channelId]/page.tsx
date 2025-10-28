import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";

async function getChannel(channelId: string) {
  noStore();
  return prisma.integrationChannel.findUnique({
    where: { id: channelId },
  });
}

async function getLogs(channelId: string) {
  return prisma.channelSyncLog.findMany({
    where: { channelId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function ChannelDetailPage({
  params,
}: {
  params: { channelId: string };
}) {
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

  const channel = await getChannel(params.channelId);
  if (!channel) {
    notFound();
  }

  const logs = await getLogs(channel.id);

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/admin/integrations/channels"
        className="text-sm text-emerald-600 hover:text-emerald-700"
      >
        ← Quay lại danh sách
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {channel.provider} · {channel.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Endpoint: {channel.endpoint ?? "—"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Last sync: {channel.lastSyncedAt ? channel.lastSyncedAt.toLocaleString("vi-VN") : "—"}
            </p>
          </div>
          <span
            className="inline-flex h-8 items-center rounded-full bg-emerald-50 px-4 text-sm font-medium text-emerald-700"
          >
            {channel.status}
          </span>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent logs</h2>
          <span className="text-xs text-gray-500">Hiển thị 50 log mới nhất</span>
        </div>
        <div className="divide-y divide-gray-100">
          {logs.length === 0 && (
            <p className="py-4 text-sm text-gray-500">Chưa có log nào.</p>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className="py-4"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {log.direction}
                  </span>
                  <span
                    className={
                      log.status === "SUCCESS"
                        ? "text-emerald-600"
                        : log.status === "FAILED"
                          ? "text-rose-600"
                          : "text-amber-600"
                    }
                  >
                    {log.status}
                  </span>
                  <span className="text-gray-700">{log.operation}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {log.createdAt.toLocaleString("vi-VN")}
                </span>
              </div>
              {log.message && (
                <p className="mt-2 text-xs text-gray-600">{log.message}</p>
              )}
              {log.payload && (
                <pre className="mt-2 overflow-x-auto rounded bg-gray-900/80 p-3 text-xs text-emerald-200">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
