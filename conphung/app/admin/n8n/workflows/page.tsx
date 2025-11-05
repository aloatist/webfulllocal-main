'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  FileJson,
  Loader2,
  CheckCircle2,
  XCircle,
  Workflow,
  FolderOpen,
} from 'lucide-react';

type WorkflowTemplate = {
  id?: string;
  name: string;
  description?: string;
  category: string;
  workflowJson: any;
  tags?: string[];
  isActive: boolean;
  usageCount: number;
  createdAt?: string;
  updatedAt?: string;
};

const categories = [
  'Booking',
  'Notification',
  'Social Media',
  'Marketing',
  'Analytics',
  'Integration',
  'Custom',
];

export default function WorkflowsManagementPage() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WorkflowTemplate | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/n8n/workflows');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(template: Partial<WorkflowTemplate>) {
    try {
      setSaving(true);
      const url = editing?.id
        ? `/api/admin/n8n/workflows/${editing.id}`
        : '/api/admin/n8n/workflows';

      const response = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        setShowDialog(false);
        setEditing(null);
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Xóa template này?')) return;

    try {
      const response = await fetch(`/api/admin/n8n/workflows/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const text = await file.text();
      const workflowJson = JSON.parse(text);

      // Auto-extract name from workflow
      const name = workflowJson.name || file.name.replace('.json', '');
      
      setEditing({
        name,
        category: 'Custom',
        workflowJson,
        isActive: false,
        usageCount: 0,
      });
      setShowDialog(true);
    } catch (error) {
      alert('Lỗi đọc file JSON');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  function handleExport(template: WorkflowTemplate) {
    const blob = new Blob([JSON.stringify(template.workflowJson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClone(template: WorkflowTemplate) {
    setEditing({
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
    });
    setShowDialog(true);
  }

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

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
            <Workflow className="w-8 h-8 text-emerald-600" />
            Workflow Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý workflow templates để import vào n8n
          </p>
        </div>

        <div className="flex gap-2">
          <label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="outline" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Import JSON
              </span>
            </Button>
          </label>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? 'Chỉnh sửa Template' : 'Tạo Template Mới'}
                </DialogTitle>
                <DialogDescription>
                  Tạo hoặc chỉnh sửa workflow template
                </DialogDescription>
              </DialogHeader>

              <WorkflowTemplateForm
                template={editing}
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{templates.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {templates.filter((t) => t.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Set(templates.map((t) => t.category)).size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Tất cả
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Templates List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có template nào</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Template Đầu Tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{template.category}</Badge>
                      {template.isActive && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {template.description && (
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Used: {template.usageCount} times</span>
                    <span>Nodes: {template.workflowJson?.nodes?.length || 0}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleExport(template)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClone(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(template);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(template.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

function WorkflowTemplateForm({
  template,
  onSave,
  onCancel,
  saving,
}: {
  template: WorkflowTemplate | null;
  onSave: (template: Partial<WorkflowTemplate>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<WorkflowTemplate>>({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'Custom',
    workflowJson: template?.workflowJson || {},
    tags: template?.tags || [],
    isActive: template?.isActive ?? false,
  });

  const [jsonEditor, setJsonEditor] = useState(
    JSON.stringify(formData.workflowJson, null, 2)
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Tour Booking Notification"
        />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>JSON Editor</Label>
          <Textarea
            value={jsonEditor}
            onChange={(e) => {
              setJsonEditor(e.target.value);
              try {
                setFormData({
                  ...formData,
                  workflowJson: JSON.parse(e.target.value),
                });
              } catch {
                // Invalid JSON, will be caught on save
              }
            }}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
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

