'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send } from 'lucide-react';

type TestWebhookCardProps = {
  defaultOperation?: string;
  defaultWebhookUrl?: string;
};

export function TestWebhookCard({
  defaultOperation = 'admin-test',
  defaultWebhookUrl,
}: TestWebhookCardProps) {
  const [operation, setOperation] = useState(defaultOperation);
  const [webhookUrl, setWebhookUrl] = useState(defaultWebhookUrl ?? '');
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        message: 'Ping from admin dashboard',
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let parsedPayload: Record<string, unknown> = {};
    try {
      parsedPayload = payload ? (JSON.parse(payload) as Record<string, unknown>) : {};
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Payload phải là JSON hợp lệ',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/n8n/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          webhookUrl: webhookUrl || undefined,
          payload: parsedPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setResult({
          type: 'error',
          message:
            data?.error ||
            data?.reason ||
            'Không thể gửi webhook. Vui lòng kiểm tra cấu hình n8n.',
        });
      } else {
        setResult({
          type: 'success',
          message: 'Đã gửi webhook thử nghiệm thành công!',
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Không thể gửi webhook',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border/60">
      <CardHeader>
        <CardTitle>Gửi webhook thử nghiệm</CardTitle>
        <CardDescription>
          Kiểm tra nhanh kết nối giữa hệ thống và n8n. Bạn có thể ghi đè URL để thử nghiệm workflow
          cụ thể.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Operation</label>
            <Input
              value={operation}
              onChange={(event) => setOperation(event.target.value)}
              placeholder="vd: homestay-booking-request"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Webhook URL (tuỳ chọn)</label>
            <Input
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
              placeholder="https://n8n.example.com/webhook/test"
            />
            <span className="text-xs text-muted-foreground">
              Để trống sẽ dùng giá trị trong biến môi trường <code>N8N_WEBHOOK_URL</code>.
            </span>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Payload (JSON)</label>
            <Textarea
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Gửi webhook
          </Button>

          {result && (
            <Alert variant={result.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
