'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Play,
  Pause,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Filter,
} from 'lucide-react';

type RuleCondition = {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
};

type AutomationRule = {
  id?: string;
  name: string;
  description?: string;
  eventType: string;
  conditions: RuleCondition[];
  actions: Array<{
    type: 'webhook' | 'email' | 'notification' | 'custom';
    config: any;
  }>;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
  triggerCount: number;
};

const operators = [
  { value: 'equals', label: 'Bằng' },
  { value: 'not_equals', label: 'Khác' },
  { value: 'contains', label: 'Chứa' },
  { value: 'greater_than', label: 'Lớn hơn' },
  { value: 'less_than', label: 'Nhỏ hơn' },
  { value: 'in', label: 'Trong danh sách' },
  { value: 'not_in', label: 'Không trong danh sách' },
];

const actionTypes = [
  { value: 'webhook', label: 'Webhook', icon: '🔗' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'notification', label: 'Notification', icon: '🔔' },
  { value: 'custom', label: 'Custom', icon: '⚙️' },
];

export default function AutomationRulesPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AutomationRule | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/n8n/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(rule: Partial<AutomationRule>) {
    try {
      setSaving(true);
      const url = editing?.id
        ? `/api/admin/n8n/rules/${editing.id}`
        : '/api/admin/n8n/rules';

      const response = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });

      if (response.ok) {
        setShowDialog(false);
        setEditing(null);
        await loadRules();
      }
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Xóa rule này?')) return;

    try {
      const response = await fetch(`/api/admin/n8n/rules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadRules();
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/n8n/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await loadRules();
      }
    } catch (error) {
      console.error('Error toggling rule:', error);
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
            <Zap className="w-8 h-8 text-emerald-600" />
            Automation Rules
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo các quy tắc tự động hóa dựa trên điều kiện
          </p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Chỉnh sửa Rule' : 'Tạo Rule Mới'}
              </DialogTitle>
              <DialogDescription>
                Định nghĩa điều kiện và hành động tự động
              </DialogDescription>
            </DialogHeader>

            <AutomationRuleForm
              rule={editing}
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rules.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {rules.filter((r) => r.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rules theo event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Set(rules.map((r) => r.eventType)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có rule nào</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Rule Đầu Tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{rule.name}</CardTitle>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">Priority: {rule.priority}</Badge>
                      <Badge variant="outline">{rule.eventType}</Badge>
                    </div>
                    {rule.description && (
                      <CardDescription>{rule.description}</CardDescription>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(rule.id!, rule.isActive)}
                    >
                      {rule.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(rule);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rule.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Conditions:</Label>
                    <div className="mt-2 space-y-1">
                      {rule.conditions.map((cond, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-muted p-2 rounded"
                        >
                          {cond.field} {operators.find(o => o.value === cond.operator)?.label} {String(cond.value)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Actions:</Label>
                    <div className="mt-2 space-y-1">
                      {rule.actions.map((action, idx) => (
                        <Badge key={idx} variant="outline" className="mr-2">
                          {actionTypes.find(a => a.value === action.type)?.icon} {actionTypes.find(a => a.value === action.type)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Triggered: {rule.triggerCount} times
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AutomationRuleForm({
  rule,
  onSave,
  onCancel,
  saving,
}: {
  rule: AutomationRule | null;
  onSave: (rule: Partial<AutomationRule>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<AutomationRule>>({
    name: rule?.name || '',
    description: rule?.description || '',
    eventType: rule?.eventType || 'custom',
    conditions: rule?.conditions || [],
    actions: rule?.actions || [],
    isActive: rule?.isActive ?? true,
    priority: rule?.priority || 1,
  });

  function addCondition() {
    setFormData({
      ...formData,
      conditions: [
        ...(formData.conditions || []),
        { field: '', operator: 'equals', value: '' },
      ],
    });
  }

  function removeCondition(index: number) {
    setFormData({
      ...formData,
      conditions: formData.conditions?.filter((_, i) => i !== index) || [],
    });
  }

  function updateCondition(index: number, field: keyof RuleCondition, value: any) {
    const conditions = [...(formData.conditions || [])];
    conditions[index] = { ...conditions[index], [field]: value };
    setFormData({ ...formData, conditions });
  }

  function addAction() {
    setFormData({
      ...formData,
      actions: [
        ...(formData.actions || []),
        { type: 'webhook', config: {} },
      ],
    });
  }

  function removeAction(index: number) {
    setFormData({
      ...formData,
      actions: formData.actions?.filter((_, i) => i !== index) || [],
    });
  }

  function updateAction(index: number, field: string, value: any) {
    const actions = [...(formData.actions || [])];
    actions[index] = { ...actions[index], [field]: value };
    setFormData({ ...formData, actions });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Send email on booking"
          />
        </div>

        <div className="space-y-2">
          <Label>Event Type *</Label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={formData.eventType}
            onChange={(e) =>
              setFormData({ ...formData, eventType: e.target.value })
            }
          >
            <option value="tour_booking">Tour Booking</option>
            <option value="homestay_booking">Homestay Booking</option>
            <option value="payment_success">Payment Success</option>
            <option value="payment_failed">Payment Failed</option>
            <option value="review_submitted">Review Submitted</option>
            <option value="custom">Custom</option>
          </select>
        </div>
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Conditions</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm Condition
          </Button>
        </div>

        <div className="space-y-2 border rounded-lg p-4">
          {formData.conditions?.map((cond, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Input
                  placeholder="Field (e.g., booking.amount)"
                  value={cond.field}
                  onChange={(e) =>
                    updateCondition(idx, 'field', e.target.value)
                  }
                />
              </div>
              <div className="col-span-3">
                <select
                  className="w-full border rounded-md px-2 py-2 text-sm"
                  value={cond.operator}
                  onChange={(e) =>
                    updateCondition(idx, 'operator', e.target.value)
                  }
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <Input
                  placeholder="Value"
                  value={cond.value}
                  onChange={(e) =>
                    updateCondition(idx, 'value', e.target.value)
                  }
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCondition(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {formData.conditions?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có condition nào. Click &quot;Thêm Condition&quot; để thêm.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Actions</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAction}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm Action
          </Button>
        </div>

        <div className="space-y-2 border rounded-lg p-4">
          {formData.actions?.map((action, idx) => (
            <div key={idx} className="space-y-2 p-3 bg-muted rounded">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Type</Label>
                  <select
                    className="w-full border rounded-md px-2 py-2"
                    value={action.type}
                    onChange={(e) =>
                      updateAction(idx, 'type', e.target.value)
                    }
                  >
                    {actionTypes.map((at) => (
                      <option key={at.value} value={at.value}>
                        {at.icon} {at.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAction(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {action.type === 'webhook' && (
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input
                    placeholder="https://..."
                    value={action.config?.url || ''}
                    onChange={(e) =>
                      updateAction(idx, 'config', {
                        ...action.config,
                        url: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {action.type === 'email' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>To</Label>
                    <Input
                      placeholder="email@example.com"
                      value={action.config?.to || ''}
                      onChange={(e) =>
                        updateAction(idx, 'config', {
                          ...action.config,
                          to: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      placeholder="Email subject"
                      value={action.config?.subject || ''}
                      onChange={(e) =>
                        updateAction(idx, 'config', {
                          ...action.config,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          {formData.actions?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có action nào. Click &quot;Thêm Action&quot; để thêm.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority (1-100)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
          <Label>Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={saving || !formData.name || (formData.conditions?.length || 0) === 0}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Lưu
        </Button>
      </div>
    </div>
  );
}

