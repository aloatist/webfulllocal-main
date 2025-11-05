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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  TestTube,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Globe,
  Settings,
  Key,
  Pause,
} from 'lucide-react';

type Connection = {
  id?: string;
  name: string;
  provider: string;
  type: 'api' | 'webhook' | 'database' | 'oauth' | 'custom';
  config: {
    endpoint?: string;
    apiKey?: string;
    secret?: string;
    username?: string;
    password?: string;
    oauth?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      accessToken?: string;
      refreshToken?: string;
    };
    [key: string]: any;
  };
  isActive: boolean;
  description?: string;
  lastTested?: string;
  testStatus?: 'success' | 'error' | 'pending';
  createdAt?: string;
  updatedAt?: string;
};

const providers = [
  { value: 'n8n', label: 'n8n', icon: '⚙️' },
  { value: 'zapier', label: 'Zapier', icon: '🔌' },
  { value: 'make', label: 'Make (Integromat)', icon: '🔄' },
  { value: 'slack', label: 'Slack', icon: '💬' },
  { value: 'telegram', label: 'Telegram', icon: '📱' },
  { value: 'facebook', label: 'Facebook API', icon: '📘' },
  { value: 'instagram', label: 'Instagram API', icon: '📷' },
  { value: 'youtube', label: 'YouTube API', icon: '📺' },
  { value: 'google_sheets', label: 'Google Sheets', icon: '📊' },
  { value: 'postgresql', label: 'PostgreSQL', icon: '🗄️' },
  { value: 'mysql', label: 'MySQL', icon: '🗄️' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
  { value: 'custom', label: 'Custom', icon: '🔧' },
];

const connectionTypes = [
  { value: 'api', label: 'API', description: 'REST API connection' },
  { value: 'webhook', label: 'Webhook', description: 'Webhook endpoint' },
  { value: 'database', label: 'Database', description: 'Database connection' },
  { value: 'oauth', label: 'OAuth', description: 'OAuth 2.0 authentication' },
  { value: 'custom', label: 'Custom', description: 'Custom connection' },
];

export default function ConnectionsManagementPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Connection | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  async function loadConnections() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/n8n/connections');
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(connection: Partial<Connection>) {
    try {
      setSaving(true);
      const url = editing?.id
        ? `/api/admin/n8n/connections/${editing.id}`
        : '/api/admin/n8n/connections';

      const response = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connection),
      });

      if (response.ok) {
        setShowDialog(false);
        setEditing(null);
        await loadConnections();
      }
    } catch (error) {
      console.error('Error saving connection:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Xóa connection này?')) return;

    try {
      const response = await fetch(`/api/admin/n8n/connections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadConnections();
      }
    } catch (error) {
      console.error('Error deleting connection:', error);
    }
  }

  async function handleTest(id: string) {
    try {
      setTesting(id);
      const response = await fetch(`/api/admin/n8n/connections/${id}/test`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadConnections();
      }
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setTesting(null);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/n8n/connections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await loadConnections();
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const byType = connections.reduce((acc, conn) => {
    acc[conn.type] = (acc[conn.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LinkIcon className="w-8 h-8 text-emerald-600" />
            Connection Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các kết nối với dịch vụ bên ngoài và APIs
          </p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Chỉnh sửa Connection' : 'Tạo Connection Mới'}
              </DialogTitle>
              <DialogDescription>
                Cấu hình kết nối với dịch vụ bên ngoài
              </DialogDescription>
            </DialogHeader>

            <ConnectionForm
              connection={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowDialog(false);
                setEditing(null);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{connections.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {connections.filter((c) => c.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">API</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{byType.api || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{byType.database || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">OAuth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{byType.oauth || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Connections List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({connections.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({connections.filter((c) => c.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({connections.filter((c) => !c.isActive).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {connections.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Chưa có connection nào</p>
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo Connection Đầu Tiên
                </Button>
              </CardContent>
            </Card>
          ) : (
            connections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{connection.name}</CardTitle>
                        <Badge variant={connection.isActive ? 'default' : 'secondary'}>
                          {connection.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{connection.type}</Badge>
                        <Badge variant="outline">
                          {providers.find((p) => p.value === connection.provider)?.icon}{' '}
                          {providers.find((p) => p.value === connection.provider)?.label}
                        </Badge>
                        {connection.testStatus && (
                          <Badge
                            variant={
                              connection.testStatus === 'success'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {connection.testStatus === 'success' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {connection.testStatus}
                          </Badge>
                        )}
                      </div>
                      {connection.description && (
                        <CardDescription>{connection.description}</CardDescription>
                      )}
                      {connection.config?.endpoint && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <Key className="h-3 w-3 inline mr-1" />
                          {connection.config.endpoint}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(connection.id!)}
                        disabled={testing === connection.id}
                      >
                        {testing === connection.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(connection.id!, connection.isActive)}
                      >
                        {connection.isActive ? <Pause className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(connection);
                          setShowDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(connection.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-4">
          {connections.filter((c) => c.isActive).map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <CardTitle>{connection.name}</CardTitle>
                <CardDescription>{connection.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4 mt-4">
          {connections.filter((c) => !c.isActive).map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <CardTitle>{connection.name}</CardTitle>
                <CardDescription>{connection.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConnectionForm({
  connection,
  onSave,
  onCancel,
  saving,
}: {
  connection: Connection | null;
  onSave: (connection: Partial<Connection>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<Connection>>({
    name: connection?.name || '',
    provider: connection?.provider || 'custom',
    type: connection?.type || 'api',
    config: connection?.config || {},
    description: connection?.description || '',
    isActive: connection?.isActive ?? true,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="n8n Webhook Connection"
          />
        </div>

        <div className="space-y-2">
          <Label>Provider</Label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
          >
            {providers.map((p) => (
              <option key={p.value} value={p.value}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select
          className="w-full border rounded-md px-3 py-2"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
        >
          {connectionTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label} - {t.description}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={2}
        />
      </div>

      {/* Config based on type */}
      <div className="space-y-4 border rounded-lg p-4">
        <Label className="text-sm font-semibold">Configuration</Label>

        {formData.type === 'api' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input
                placeholder="https://api.example.com"
                value={formData.config?.endpoint || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: { ...formData.config, endpoint: e.target.value },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="your-api-key"
                  value={formData.config?.apiKey || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, apiKey: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Secret</Label>
                <Input
                  type="password"
                  placeholder="your-secret"
                  value={formData.config?.secret || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, secret: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === 'webhook' && (
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://n8n.example.com/webhook/..."
              value={formData.config?.endpoint || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config, endpoint: e.target.value },
                })
              }
            />
          </div>
        )}

        {formData.type === 'database' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Host</Label>
                <Input
                  placeholder="localhost"
                  value={formData.config?.host || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, host: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  type="number"
                  placeholder="5432"
                  value={formData.config?.port || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, port: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Database</Label>
                <Input
                  placeholder="database_name"
                  value={formData.config?.database || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, database: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="username"
                  value={formData.config?.username || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, username: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="password"
                value={formData.config?.password || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: { ...formData.config, password: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {formData.type === 'oauth' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input
                  placeholder="your-client-id"
                  value={formData.config?.oauth?.clientId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: {
                        ...formData.config,
                        oauth: {
                          ...formData.config?.oauth,
                          clientId: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <Input
                  type="password"
                  placeholder="your-client-secret"
                  value={formData.config?.oauth?.clientSecret || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: {
                        ...formData.config,
                        oauth: {
                          ...formData.config?.oauth,
                          clientSecret: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Redirect URI</Label>
              <Input
                placeholder="https://yourapp.com/callback"
                value={formData.config?.oauth?.redirectUri || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      oauth: {
                        ...formData.config?.oauth,
                        redirectUri: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <Label>Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={saving || !formData.name}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Lưu
        </Button>
      </div>
    </div>
  );
}

