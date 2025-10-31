'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, RefreshCw, Eye, EyeOff, Shield, AlertCircle, CheckCircle2, Loader2, Info, Plus, Trash2, Edit, Copy, Download, Upload, History } from 'lucide-react';
import type { EnvConfig, EnvVariable, EnvCategory } from '@/lib/env/types';
import { categoryLabels } from '@/lib/env/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EnvironmentVariablesPage() {
  const [config, setConfig] = useState<EnvConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [editingVariable, setEditingVariable] = useState<EnvVariable | null>(null);
  const [backupList, setBackupList] = useState<string[]>([]);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [newVariable, setNewVariable] = useState<Partial<EnvVariable>>({
    key: '',
    value: '',
    category: 'other',
    description: '',
    isSecret: false,
    isPublic: false,
    isRequired: false,
    example: '',
    order: 999,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/env');
      
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }
      
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
      setStatus('error');
      setErrorMessage('Không thể tải cấu hình');
    } finally {
      setLoading(false);
    }
  }

  async function saveVariable(key: string, value: string) {
    try {
      setSavingKeys(prev => new Set(prev).add(key));
      
      const response = await fetch('/api/admin/env', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to save variable');
    } finally {
      setSavingKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  function toggleSecretVisibility(key: string) {
    setVisibleSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }

  function updateVariable(key: string, value: string) {
    if (!config) return;
    
    setConfig({
      ...config,
      variables: config.variables.map(v =>
        v.key === key ? { ...v, value } : v
      ),
    });
  }

  async function loadBackups() {
    try {
      const response = await fetch('/api/admin/env/backups');
      if (response.ok) {
        const data = await response.json();
        setBackupList(data.backups || []);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  }

  async function restoreBackup(filename: string) {
    if (!confirm(`Restore from backup: ${filename}?\n\nThis will replace current .env file!`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/env/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to restore');
      }

      setStatus('success');
      setShowBackupDialog(false);
      await loadConfig();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to restore backup');
    } finally {
      setSaving(false);
    }
  }

  async function createBackup() {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/env/backup', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create backup');
      }

      const data = await response.json();
      setStatus('success');
      alert(`Backup created: ${data.filename}`);
      await loadBackups();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to create backup');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddVariable() {
    if (!newVariable.key || !newVariable.value) {
      setErrorMessage('Key and Value are required');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVariable),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add');
      }

      setStatus('success');
      setShowAddDialog(false);
      setNewVariable({
        key: '',
        value: '',
        category: 'other',
        description: '',
        isSecret: false,
        isPublic: false,
        isRequired: false,
        example: '',
        order: 999,
      });
      await loadConfig();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to add variable');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVariable(key: string) {
    if (!confirm(`Delete ${key}?`)) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/env?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setStatus('success');
      await loadConfig();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to delete variable');
    } finally {
      setSaving(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  function getVariablesByCategory(category: string) {
    return config?.variables.filter(v => v.category === category) || [];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Environment Variables
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cấu hình môi trường (.env file)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadConfig} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm biến mới
          </Button>
          <Button variant="outline" onClick={createBackup} disabled={saving}>
            <Download className="w-4 h-4 mr-2" />
            Tạo Backup
          </Button>
          <Button variant="outline" onClick={() => { setShowBackupDialog(true); loadBackups(); }}>
            <History className="w-4 h-4 mr-2" />
            Phục hồi
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            ✅ Đã lưu thành công! 
            <strong className="ml-2">⚠️ Cần restart server để áp dụng thay đổi.</strong>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Security Warning */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>⚠️ Cẩn thận:</strong> Backup tự động được tạo trước khi lưu. 
          Secret values được ẩn mặc định. Click biểu tượng con mắt để xem.
        </AlertDescription>
      </Alert>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          💡 <strong>Lưu ý:</strong> Các biến với prefix <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_</code> 
          sẽ được expose ra client-side. Rebuild app để áp dụng thay đổi.
        </AlertDescription>
      </Alert>

      {/* Tabs by Category */}
      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-8">
          <TabsTrigger value="database">🗄️ Database</TabsTrigger>
          <TabsTrigger value="auth">🔐 Auth</TabsTrigger>
          <TabsTrigger value="oauth">👤 OAuth</TabsTrigger>
          <TabsTrigger value="api">🌐 API</TabsTrigger>
          <TabsTrigger value="payment">💳 Payment</TabsTrigger>
          <TabsTrigger value="email">📧 Email</TabsTrigger>
          <TabsTrigger value="webhook">🔗 Webhook</TabsTrigger>
          <TabsTrigger value="other">⚙️ Other</TabsTrigger>
        </TabsList>

        {Object.entries(categoryLabels).map(([category, label]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getVariablesByCategory(category).map((variable) => (
              <Card key={variable.key}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {variable.key}
                        {variable.isRequired && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            Required
                          </span>
                        )}
                        {variable.isPublic && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            PUBLIC
                          </span>
                        )}
                        {variable.isSecret && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Secret
                          </span>
                        )}
                      </CardTitle>
                      {variable.description && (
                        <CardDescription className="mt-1">
                          {variable.description}
                        </CardDescription>
                      )}
                    </div>
                    {variable.isSecret && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSecretVisibility(variable.key)}
                      >
                        {visibleSecrets.has(variable.key) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor={variable.key}>Value</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={variable.key}
                        type={variable.isSecret && !visibleSecrets.has(variable.key) ? 'password' : 'text'}
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.key, e.target.value)}
                        placeholder={variable.example}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => saveVariable(variable.key, variable.value)}
                        disabled={savingKeys.has(variable.key)}
                        title="Save this variable"
                      >
                        {savingKeys.has(variable.key) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(variable.value)}
                        title="Copy value"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVariable(variable.key)}
                        title="Delete variable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {variable.example && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Example:</strong> <code className="bg-gray-100 px-1 rounded">{variable.example}</code>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {getVariablesByCategory(category).length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Không có biến môi trường nào trong category này
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Variable Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm biến môi trường mới</DialogTitle>
            <DialogDescription>
              Thêm biến mới vào file .env. Backup sẽ được tạo tự động.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-key">Key *</Label>
              <Input
                id="new-key"
                value={newVariable.key || ''}
                onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                placeholder="MY_NEW_VARIABLE"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-value">Value *</Label>
              <Input
                id="new-value"
                value={newVariable.value || ''}
                onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                placeholder="value here"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-category">Category</Label>
              <Select
                value={newVariable.category || 'other'}
                onValueChange={(value) => setNewVariable({ ...newVariable, category: value as EnvCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newVariable.description || ''}
                onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                placeholder="What is this variable for?"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-example">Example</Label>
              <Input
                id="new-example"
                value={newVariable.example || ''}
                onChange={(e) => setNewVariable({ ...newVariable, example: e.target.value })}
                placeholder="example value"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-order">Order (Thứ tự hiển thị)</Label>
              <Input
                id="new-order"
                type="number"
                value={newVariable.order || 999}
                onChange={(e) => setNewVariable({ ...newVariable, order: parseInt(e.target.value) || 999 })}
                placeholder="999"
              />
              <p className="text-xs text-muted-foreground">
                Số nhỏ hơn sẽ hiện trước. Mặc định: 999
              </p>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newVariable.isSecret || false}
                  onChange={(e) => setNewVariable({ ...newVariable, isSecret: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Is Secret (masked)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newVariable.isPublic || false}
                  onChange={(e) => setNewVariable({ ...newVariable, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Is Public (NEXT_PUBLIC_)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newVariable.isRequired || false}
                  onChange={(e) => setNewVariable({ ...newVariable, isRequired: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Required</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddVariable} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Thêm biến
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup/Restore Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Phục hồi từ Backup</DialogTitle>
            <DialogDescription>
              Chọn backup để phục hồi. File .env hiện tại sẽ được backup trước khi restore.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {backupList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Chưa có backup nào
              </div>
            ) : (
              backupList.map((filename) => (
                <div
                  key={filename}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(filename.replace('.env.', '').replace(/-/g, ':')).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => restoreBackup(filename)}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Restore
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
