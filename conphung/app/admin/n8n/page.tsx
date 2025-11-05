import { unstable_noStore as noStore } from "next/cache";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";
import Link from "next/link";
import { requireEditor } from "@/lib/tours/permissions";
import { getN8nDashboardData } from "@/lib/integrations/n8n-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestWebhookCard } from "./test-webhook-card";
import { RetryButton } from "./retry-button";
import { Webhook, Workflow, Settings, Activity, Zap, Link as LinkIcon } from "lucide-react";

const statusClasses: Record<string, string> = {
  online: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  degraded: "bg-amber-100 text-amber-700 border border-amber-200",
  offline: "bg-rose-100 text-rose-700 border border-rose-200",
};

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
}

export default async function AdminN8nDashboardPage() {
  noStore();
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">{auth.error}</h1>
      </div>
    );
  }

  const data = await getN8nDashboardData();
  const defaultWebhookUrl = process.env.N8N_WEBHOOK_URL;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">n8n Automation</h1>
          <Badge
            className={clsx(
              "text-sm font-medium",
              statusClasses[data.status.status] ?? "bg-gray-200 text-gray-700",
            )}
          >
            {data.status.status === "online"
              ? "Đang hoạt động"
              : data.status.status === "degraded"
                ? "Cảnh báo"
                : "Mất kết nối"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Quản lý webhooks, workflows, và tự động hóa các quy trình kinh doanh
        </p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số log</CardTitle>
            <CardDescription>Toàn bộ inbound/outbound ghi nhận</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{data.metrics.totalLogs}</p>
            <p className="text-xs text-muted-foreground">
              Cập nhật: {formatDate(data.metrics.lastEventAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thành công (7 ngày)</CardTitle>
            <CardDescription>Webhook thực thi OK</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">
              {data.metrics.successCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Tỉ lệ thành công {data.metrics.successRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thất bại (7 ngày)</CardTitle>
            <CardDescription>Webhook trả lỗi</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-rose-600">
              {data.metrics.failureCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Chi tiết xem trong bảng log bên dưới
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health check</CardTitle>
            <CardDescription>Trạng thái n8n REST</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-lg font-medium">
              {data.status.ok ? "✓ Kết nối thành công" : "✕ Không thể kết nối"}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.status.error
                ? data.status.error
                : data.status.details?.status ?? "Phản hồi ổn định"}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>Channels</CardTitle>
            <CardDescription>
              Tổng quan kết nối provider&nbsp;
              <code>n8n</code>. Nhấp vào từng channel để xem log chi tiết.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.channels.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có channel nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-border/60 bg-background text-sm">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Tên channel</th>
                      <th className="px-4 py-3 text-left">Endpoint</th>
                      <th className="px-4 py-3 text-left">Log</th>
                      <th className="px-4 py-3 text-left">Lần cuối</th>
                      <th className="px-4 py-3 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channels.map((channel) => (
                      <tr key={channel.id} className="border-t border-border/40">
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/admin/integrations/channels/${channel.id}`}
                            className="text-emerald-600 hover:underline"
                          >
                            {channel.provider} · {channel.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {channel.endpoint ?? "—"}
                        </td>
                        <td className="px-4 py-3">{channel.logCount ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(channel.lastLog)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge
                            className={clsx(
                              "text-xs",
                              channel.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700"
                                : channel.status === "ERROR"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700",
                            )}
                          >
                            {channel.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <TestWebhookCard
          defaultOperation="admin-test"
          defaultWebhookUrl={defaultWebhookUrl}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Nhật ký gần nhất</h2>
            <p className="text-sm text-muted-foreground">
              Hiển thị 25 log cuối. Bạn có thể gửi lại payload với log lỗi.
            </p>
          </div>
        </div>
        <Card className="border border-border/60">
          <CardContent className="p-0">
            <ScrollArea className="h-[460px]">
              <div className="divide-y divide-border/60">
                {data.logs.length === 0 && (
                  <p className="p-6 text-sm text-muted-foreground">Chưa có log nào.</p>
                )}
                {data.logs.map((log) => (
                  <div key={log.id} className="grid gap-3 p-4 md:grid-cols-[1fr,auto]">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="uppercase">
                          {log.direction}
                        </Badge>
                        <span
                          className={clsx(
                            "font-medium",
                            log.status === "SUCCESS"
                              ? "text-emerald-600"
                              : log.status === "FAILED"
                                ? "text-rose-600"
                                : "text-amber-600",
                          )}
                        >
                          {log.status}
                        </span>
                        <span className="text-muted-foreground">{log.operation}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      {log.message && (
                        <p className="text-xs text-muted-foreground">{log.message}</p>
                      )}
                      {log.payload && (
                        <pre className="max-h-64 overflow-y-auto rounded bg-slate-950/90 p-3 text-xs text-emerald-200">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                    <RetryButton logId={log.id} disabled={log.status === "SUCCESS"} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Management</CardTitle>
              <CardDescription>
                Quản lý các webhooks để kết nối với n8n và các dịch vụ bên ngoài
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/n8n/webhooks">
                <Button className="w-full">
                  <Webhook className="mr-2 h-4 w-4" />
                  Quản lý Webhooks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Quản lý các workflow templates và tự động hóa quy trình
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/n8n/workflows">
                <Button className="w-full">
                  <Workflow className="mr-2 h-4 w-4" />
                  Quản lý Workflow Templates
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/n8n/rules">
                  <Button variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Automation Rules
                  </Button>
                </Link>
                <Link href="/admin/n8n/connections">
                  <Button variant="outline" className="w-full">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Connections
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt n8n</CardTitle>
              <CardDescription>
                Cấu hình kết nối và thiết lập n8n automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  N8N Webhook URL
                </Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  {process.env.N8N_WEBHOOK_URL || 'Chưa cấu hình'}
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Thiết lập trong file .env với key N8N_WEBHOOK_URL
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  N8N Dashboard URL
                </Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  http://localhost:5678
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Truy cập n8n dashboard để quản lý workflows
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
