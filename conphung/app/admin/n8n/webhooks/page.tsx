'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Eye, 
  Copy,
  CheckCircle2,
  XCircle,
  Loader2,
  Webhook,
  Settings,
} from 'lucide-react';
import { eventTypeLabels, type Webhook } from '@/lib/n8n/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function WebhooksManagementPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Webhook | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadWebhooks();
  }, []);

  async function loadWebhooks() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/n8n/webhooks');
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.webhooks || []);
      }
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(webhook: Partial<Webhook>) {
    try {
      setSaving(true);
      setStatus('idle');
      
      const url = editing?.id 
        ? `/api/admin/n8n/webhooks/${editing.id}`
        : '/api/admin/n8n/webhooks';
      
      const response = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhook),
      });

      if (response.ok) {
        setStatus('success');
        setShowDialog(false);
        setEditing(null);
        await loadWebhooks();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu webhook');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa webhook này?')) return;
    
    try {
      const response = await fetch(`/api/admin/n8n/webhooks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadWebhooks();
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/n8n/webhooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await loadWebhooks();
      }
    } catch (error) {
      console.error('Error toggling webhook:', error);
    }
  }

  async function handleTest(id: string) {
    try {
      const response = await fetch(`/api/admin/n8n/webhooks/${id}/test`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Test webhook đã được gửi!');
      }
    } catch (error) {
      alert('Lỗi khi test webhook');
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Webhook className="w-8 h-8 text-emerald-600" />
            Webhook Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý webhooks để kết nối với n8n và các dịch vụ bên ngoài
          </p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Chỉnh sửa Webhook' : 'Tạo Webhook Mới'}
              </DialogTitle>
              <DialogDescription>
                Cấu hình webhook để tự động hóa các sự kiện
              </DialogDescription>
            </DialogHeader>

            <WebhookForm
              webhook={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowDialog(false);
                setEditing(null);
              }}
              saving={saving}
              status={status}
              errorMessage={errorMessage}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng số</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{webhooks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {webhooks.filter(w => w.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {webhooks.reduce((sum, w) => sum + (w.triggerCount || 0), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tỷ lệ thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {(() => {
                const total = webhooks.reduce((sum, w) => sum + (w.triggerCount || 0), 0);
                const success = webhooks.reduce((sum, w) => sum + (w.successCount || 0), 0);
                return total > 0 ? Math.round((success / total) * 100) : 0;
              })()}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Webhooks</CardTitle>
          <CardDescription>
            Quản lý và cấu hình các webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-12">
              <Webhook className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có webhook nào</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Webhook Đầu Tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {eventTypeLabels[webhook.eventType as keyof typeof eventTypeLabels] || webhook.eventType}
                        </Badge>
                      </div>
                      {webhook.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {webhook.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>URL: {webhook.url}</span>
                        <span>Method: {webhook.method}</span>
                        <span>Triggers: {webhook.triggerCount || 0}</span>
                        <span>Success: {webhook.successCount || 0}</span>
                        <span>Errors: {webhook.errorCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(webhook.id!, webhook.isActive)}
                      >
                        {webhook.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(webhook.id!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(webhook);
                          setShowDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(webhook.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WebhookForm({
  webhook,
  onSave,
  onCancel,
  saving,
  status,
  errorMessage,
}: {
  webhook: Webhook | null;
  onSave: (webhook: Partial<Webhook>) => void;
  onCancel: () => void;
  saving: boolean;
  status: 'idle' | 'success' | 'error';
  errorMessage: string;
}) {
  const [formData, setFormData] = useState<Partial<Webhook>>({
    name: webhook?.name || '',
    eventType: webhook?.eventType || 'custom',
    url: webhook?.url || '',
    method: webhook?.method || 'POST',
    description: webhook?.description || '',
    isActive: webhook?.isActive ?? true,
    timeout: webhook?.timeout || 10000,
    retryAttempts: webhook?.retryAttempts || 3,
    retryDelay: webhook?.retryDelay || 5000,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Homestay Booking Notification"
        />
      </div>

      <div className="space-y-2">
        <Label>Event Type *</Label>
        <select
          className="w-full border rounded-md px-3 py-2"
          value={formData.eventType}
          onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
        >
          {Object.entries(eventTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>URL *</Label>
        <Input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://n8n.example.com/webhook/..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Method</Label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Timeout (ms)</Label>
          <Input
            type="number"
            value={formData.timeout}
            onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Retry Attempts</Label>
          <Input
            type="number"
            value={formData.retryAttempts}
            onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Retry Delay (ms)</Label>
          <Input
            type="number"
            value={formData.retryDelay}
            onChange={(e) => setFormData({ ...formData, retryDelay: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Active</Label>
      </div>

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {status === 'success' && (
        <Alert className="border-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Đã lưu thành công!</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={saving || !formData.name || !formData.url}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Lưu
        </Button>
      </div>
    </div>
  );
}

