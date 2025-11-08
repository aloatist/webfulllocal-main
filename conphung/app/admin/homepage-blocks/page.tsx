'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Send,
  RotateCcw,
} from 'lucide-react';
import { BlockEditor } from '@/components/admin/blocks/BlockEditor';
import { getAllBlockTypes } from '@/lib/blocks/registry';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HomepageBlock {
  id: string;
  type: string;
  title?: string | null;
  fields: any;
  sortOrder: number;
  status: string;
  themeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

function SortableBlockItem({
  block,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  block: HomepageBlock;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const blockTypes = getAllBlockTypes();
  const blockSchema = blockTypes.find((b) => b.type === block.type);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-4 transition-all duration-200 ${
        block.status === 'DISABLED' ? 'opacity-50' : ''
      } ${isDragging ? 'shadow-lg ring-2 ring-primary scale-105 z-50' : 'hover:shadow-md'}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className={`cursor-grab active:cursor-grabbing p-2 rounded transition-colors ${
                isDragging 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
              }`}
            >
              <GripVertical className={`w-5 h-5 transition-colors ${
                isDragging ? 'text-primary' : ''
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">
                  {block.title || blockSchema?.name || block.type}
                </CardTitle>
                <Badge variant={block.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {block.status === 'ACTIVE' ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {block.status}
                </Badge>
                <Badge variant="outline">
                  {blockSchema?.icon} {block.type}
                </Badge>
              </div>
              {blockSchema?.description && (
                <p className="text-sm text-gray-500">{blockSchema.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleStatus}
              title={block.status === 'ACTIVE' ? 'Ẩn block' : 'Hiện block'}
            >
              {block.status === 'ACTIVE' ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function HomepageBlocksPage() {
  const [blocks, setBlocks] = useState<HomepageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingBlock, setEditingBlock] = useState<HomepageBlock | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState('');
  const [hasPublishedSettings, setHasPublishedSettings] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true); // Auto-sync khi sắp xếp
  const [lastSyncResult, setLastSyncResult] = useState<{ success: boolean; blocksCount?: number; error?: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadBlocks();
    checkPublishedSettings();
  }, []);

  async function checkPublishedSettings() {
    try {
      const response = await fetch('/api/admin/homepage-settings-unified');
      if (response.ok) {
        const data = await response.json();
        setHasPublishedSettings(data.settings?.status === 'PUBLISHED');
      }
    } catch (error) {
      console.error('Error checking published settings:', error);
    }
  }

  async function loadBlocks() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage-blocks?status=all');
      
      if (!response.ok) {
        throw new Error('Failed to load blocks');
      }
      
      const data = await response.json();
      setBlocks(data.blocks || []);
      // Reset sync result khi load lại blocks
      setLastSyncResult(null);
    } catch (error) {
      console.error('Error loading blocks:', error);
      setStatus('error');
      setErrorMessage('Không thể tải danh sách blocks');
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);

    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(newBlocks);

    // IMPORTANT: Chỉ update sortOrder, KHÔNG sync về settings
    // Homepage-blocks và homepage-settings là 2 hệ thống độc lập
    // Kéo thả chỉ sắp xếp blocks, không ảnh hưởng đến dữ liệu trong settings
    try {
      const updates = newBlocks.map((block, index) => ({
        id: block.id,
        sortOrder: index,
      }));

      const response = await fetch('/api/admin/homepage-blocks/sort', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sort order');
      }

      // Auto-sync dữ liệu blocks sang Home Settings (nếu bật)
      // Điều này đảm bảo dữ liệu fields và thứ tự sắp xếp của blocks được sync sang Home Settings
      // Reset sync result trước khi sync
      setLastSyncResult(null);
      if (autoSyncEnabled) {
        try {
          console.log("🔄 Đang tự động đồng bộ dữ liệu blocks sang Home Settings...");
          const syncResponse = await fetch('/api/admin/homepage-blocks/sync-to-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'DRAFT', // Luôn sync sang DRAFT để không ảnh hưởng PUBLISHED settings
            }),
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();
            const blocksCount = syncResult.blocksCount || newBlocks.length;
            console.log(`✅ Đã tự động đồng bộ ${blocksCount} blocks sang Home Settings (DRAFT)`);
            // Lưu kết quả sync để hiển thị trong message
            setLastSyncResult({ success: true, blocksCount });
            // Check lại published settings
            await checkPublishedSettings();
          } else {
            const errorData = await syncResponse.json().catch(() => ({}));
            const errorMsg = errorData.error || 'Unknown error';
            console.warn("⚠️ Không thể tự động đồng bộ:", errorMsg);
            console.log("💡 Thứ tự blocks đã được cập nhật, nhưng dữ liệu chưa được sync. Bạn có thể sync thủ công bằng button 'Đồng bộ về Home Settings'");
            // Lưu kết quả lỗi
            setLastSyncResult({ success: false, error: errorMsg });
          }
        } catch (syncError) {
          // Không fail cả process nếu sync lỗi, chỉ log warning
          const errorMsg = syncError instanceof Error ? syncError.message : 'Unknown error';
          console.warn('Auto-sync failed (non-critical):', syncError);
          console.log("💡 Thứ tự blocks đã được cập nhật, nhưng dữ liệu chưa được sync. Bạn có thể sync thủ công bằng button 'Đồng bộ về Home Settings'");
          // Lưu kết quả lỗi
          setLastSyncResult({ success: false, error: errorMsg });
        }
      }

      // Show success message
      setStatus('success');
      setErrorMessage('');
      // Message sẽ hiển thị thông tin về auto-sync trong component Alert
      setTimeout(() => setStatus('idle'), 5000); // Tăng thời gian hiển thị để user đọc thông tin sync
    } catch (error) {
      console.error('Error updating sort order:', error);
      // Revert on error
      setBlocks(blocks);
      setStatus('error');
      setErrorMessage('Không thể cập nhật thứ tự');
    }
  }

  async function handleSaveBlock(blockData: any) {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/homepage-blocks/${blockData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockData),
      });

      if (!response.ok) {
        throw new Error('Failed to save block');
      }

      await loadBlocks();
      
      // Auto-sync sau khi save block (nếu bật)
      if (autoSyncEnabled) {
        try {
          const syncResponse = await fetch('/api/admin/homepage-blocks/sync-to-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'DRAFT',
            }),
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();
            setLastSyncResult({ success: true, blocksCount: syncResult.blocksCount });
            console.log(`✅ Đã tự động đồng bộ sau khi lưu block: ${syncResult.blocksCount} blocks`);
          }
        } catch (syncError) {
          console.warn('Auto-sync after save failed (non-critical):', syncError);
        }
      }
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving block:', error);
      setStatus('error');
      setErrorMessage('Không thể lưu block');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBlock(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa block này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homepage-blocks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete block');
      }

      await loadBlocks();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error deleting block:', error);
      setStatus('error');
      setErrorMessage('Không thể xóa block');
    }
  }

  async function handleToggleStatus(block: HomepageBlock) {
    try {
      const response = await fetch(`/api/admin/homepage-blocks/${block.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: block.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }

      await loadBlocks();
    } catch (error) {
      console.error('Error toggling status:', error);
      setStatus('error');
      setErrorMessage('Không thể thay đổi trạng thái');
    }
  }

  async function handleAddBlock() {
    if (!newBlockType) return;

    try {
      setSaving(true);
      const blockTypes = getAllBlockTypes();
      const schema = blockTypes.find((b) => b.type === newBlockType);
      
      if (!schema) {
        throw new Error('Invalid block type');
      }

      // Initialize fields with default values
      const defaultFields: any = {};
      schema.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaultFields[field.key] = field.defaultValue;
        }
      });

      const response = await fetch('/api/admin/homepage-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newBlockType,
          fields: defaultFields,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create block');
      }

      setIsAddDialogOpen(false);
      setNewBlockType('');
      await loadBlocks();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating block:', error);
      setStatus('error');
      setErrorMessage('Không thể tạo block');
    } finally {
      setSaving(false);
    }
  }

  async function handleSyncToSettings() {
    // Cảnh báo rõ ràng về việc sync
    const warningMessage = hasPublishedSettings
      ? '⚠️ CẢNH BÁO: Hiện có Home Settings đã được PUBLISHED.\n\n' +
        'Bạn có chắc muốn đồng bộ blocks về Home Settings?\n\n' +
        '⚠️ Điều này sẽ GHI ĐÈ dữ liệu hiện tại trong Home Settings.\n' +
        '📌 Dữ liệu trong PUBLISHED settings sẽ bị thay thế bởi dữ liệu từ blocks.\n' +
        '✅ Blocks sẽ được lưu dưới dạng DRAFT, không ảnh hưởng đến PUBLISHED settings hiện tại.\n\n' +
        'Bạn có muốn tiếp tục?'
      : 'Bạn có chắc muốn đồng bộ blocks về Home Settings?\n\n' +
        '⚠️ Điều này sẽ ghi đè dữ liệu hiện tại trong Home Settings (nếu có).\n' +
        '✅ Blocks sẽ được lưu dưới dạng DRAFT.\n\n' +
        'Bạn có muốn tiếp tục?';

    if (!confirm(warningMessage)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/homepage-blocks/sync-to-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DRAFT', // Save as draft first - KHÔNG ghi đè PUBLISHED settings
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync to settings');
      }

      const result = await response.json();
      setStatus('success');
      setErrorMessage('');
      // Lưu kết quả sync
      setLastSyncResult({ success: true, blocksCount: result.blocksCount });
      
      // Show success message
      if (hasPublishedSettings) {
        // Nếu có PUBLISHED settings, cảnh báo rằng DRAFT settings mới sẽ không được hiển thị
        setTimeout(() => {
          setStatus('idle');
        }, 7000);
      } else {
        setTimeout(() => setStatus('idle'), 5000);
      }
      
      // Check again for published settings
      await checkPublishedSettings();
      
      // NOTE: Không cần reload blocks vì sync chỉ update settings, không thay đổi blocks
    } catch (error) {
      console.error('Error syncing to settings:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Không thể đồng bộ về Home Settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Info Alert - Blocks luôn được hiển thị */}
      {hasPublishedSettings && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            <div className="space-y-2">
              <p>
                <strong>ℹ️ Thông tin:</strong> Hiện có Home Settings đã được PUBLISHED.
              </p>
              <p>
                <strong>📌 Quan trọng:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-green-600">Blocks LUÔN được hiển thị trên homepage</strong> để sắp xếp thứ tự các section.
                </li>
                <li>
                  <strong>Blocks và Settings là 2 hệ thống độc lập.</strong> Kéo thả blocks chỉ sắp xếp thứ tự, 
                  <strong className="text-green-600"> KHÔNG ảnh hưởng đến dữ liệu trong Home Settings.</strong>
                </li>
                <li>
                  <strong>Homepage sẽ ưu tiên hiển thị Blocks</strong> (nếu có blocks) để quản lý thứ tự hiển thị.
                </li>
                <li>
                  PUBLISHED Settings chỉ để <strong>lưu dữ liệu</strong>, nhưng Blocks mới quyết định <strong>hiển thị và sắp xếp</strong>.
                </li>
              </ul>
              <p className="text-sm mt-2 text-green-600">
                ✅ <strong>Dữ liệu trong Home Settings được bảo vệ:</strong> Kéo thả blocks không làm mất dữ liệu đã sửa trong Home Settings.
              </p>
              {autoSyncEnabled && (
                <p className="text-sm mt-2 text-blue-600">
                  🔄 <strong>Tự động đồng bộ đã bật:</strong> Khi sắp xếp blocks, dữ liệu sẽ tự động sync sang Home Settings (DRAFT).
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Homepage Blocks</h1>
          <p className="text-gray-500 mt-2">
            Quản lý các block hiển thị trên trang chủ. Kéo thả để sắp xếp thứ tự.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncEnabled}
                onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-600">
                {autoSyncEnabled ? (
                  <span className="text-green-600 font-medium">✓ Tự động đồng bộ dữ liệu khi sắp xếp</span>
                ) : (
                  <span>⨯ Tắt tự động đồng bộ</span>
                )}
              </span>
            </label>
            <span className="text-xs text-gray-400">
              (Khi bật: Dữ liệu blocks sẽ tự động sync sang Home Settings khi kéo thả)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncToSettings}
            disabled={saving}
            title="Đồng bộ blocks về Home Settings"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang đồng bộ...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Đồng bộ về Home Settings
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              if (!confirm('Bạn có chắc muốn reset về mặc định? Tất cả thay đổi sẽ bị mất.')) {
                return;
              }
              try {
                setSaving(true);
                const response = await fetch('/api/admin/homepage-blocks/sync', {
                  method: 'POST',
                });
                if (!response.ok) throw new Error('Sync failed');
                const data = await response.json();
                await loadBlocks();
                setStatus('success');
                setErrorMessage('');
                setTimeout(() => setStatus('idle'), 3000);
              } catch (error) {
                console.error('Error syncing:', error);
                setStatus('error');
                setErrorMessage('Không thể reset về mặc định');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang reset...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Mặc định
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                setSaving(true);
                // Save all blocks as draft
                const response = await fetch('/api/admin/homepage-blocks/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    blocks: blocks.map((b, index) => ({
                      id: b.id,
                      sortOrder: index,
                    })),
                    status: 'DRAFT',
                  }),
                });
                if (!response.ok) throw new Error('Save failed');
                await loadBlocks();
                setStatus('success');
                setErrorMessage('');
                setTimeout(() => setStatus('idle'), 3000);
              } catch (error) {
                console.error('Error saving:', error);
                setStatus('error');
                setErrorMessage('Không thể lưu');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </>
            )}
          </Button>
          <Button
            onClick={async () => {
              if (!confirm('Bạn có chắc muốn xuất bản? Nội dung sẽ hiển thị trên trang chủ.')) {
                return;
              }
              try {
                setSaving(true);
                const response = await fetch('/api/admin/homepage-blocks/publish', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    blocks: blocks.map((b, index) => ({
                      id: b.id,
                      sortOrder: index,
                    })),
                  }),
                });
                if (!response.ok) throw new Error('Publish failed');
                await loadBlocks();
                setStatus('success');
                setErrorMessage('');
                setTimeout(() => setStatus('idle'), 3000);
              } catch (error) {
                console.error('Error publishing:', error);
                setStatus('error');
                setErrorMessage('Không thể xuất bản');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xuất bản...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Xuất bản
              </>
            )}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Block
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn loại block</DialogTitle>
              <DialogDescription>
                Chọn loại block bạn muốn thêm vào homepage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Loại block</Label>
              <Select value={newBlockType} onValueChange={setNewBlockType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại block" />
                </SelectTrigger>
                <SelectContent>
                  {getAllBlockTypes().map((blockType) => (
                    <SelectItem key={blockType.type} value={blockType.type}>
                      {blockType.icon} {blockType.name} - {blockType.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddBlock} disabled={!newBlockType || saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo Block'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            {hasPublishedSettings ? (
              <div>
                <p className="font-semibold">✅ Đã sắp xếp blocks thành công!</p>
                {autoSyncEnabled && lastSyncResult?.success ? (
                  <>
                    <p className="text-sm mt-1 text-green-600">
                      ✅ Đã tự động đồng bộ {lastSyncResult.blocksCount || blocks.length} blocks sang Home Settings (DRAFT).
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      💡 Dữ liệu fields và thứ tự sắp xếp đã được cập nhật. Blocks sẽ được hiển thị trên homepage.
                    </p>
                  </>
                ) : autoSyncEnabled && lastSyncResult && !lastSyncResult.success ? (
                  <>
                    <p className="text-sm mt-1 text-yellow-600">
                      ⚠️ Thứ tự đã được cập nhật, nhưng đồng bộ dữ liệu thất bại: {lastSyncResult.error || 'Unknown error'}
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      💡 Vui lòng click "Đồng bộ về Home Settings" để sync thủ công.
                    </p>
                  </>
                ) : autoSyncEnabled ? (
                  <>
                    <p className="text-sm mt-1 text-blue-600">
                      🔄 Đang đồng bộ dữ liệu sang Home Settings...
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm mt-1 text-yellow-600">
                      ⚠️ Dữ liệu chưa được đồng bộ. Bật "Tự động đồng bộ" hoặc click "Đồng bộ về Home Settings" để sync.
                    </p>
                    <p className="text-sm mt-1 text-green-600">
                      💡 Blocks sẽ được hiển thị trên homepage để sắp xếp thứ tự các section.
                    </p>
                  </>
                )}
                <p className="text-sm mt-1 text-green-600">
                  ✅ PUBLISHED Settings được bảo vệ, không bị ảnh hưởng.
                </p>
              </div>
            ) : autoSyncEnabled && lastSyncResult?.success ? (
              <div>
                <p className="font-semibold">✅ Đã sắp xếp và đồng bộ blocks thành công!</p>
                <p className="text-sm mt-1 text-green-600">
                  ✅ Đã tự động đồng bộ {lastSyncResult.blocksCount || blocks.length} blocks sang Home Settings (DRAFT).
                </p>
                <p className="text-sm mt-1 text-gray-600">
                  💡 Dữ liệu fields và thứ tự sắp xếp đã được cập nhật trong Home Settings.
                </p>
              </div>
            ) : autoSyncEnabled && lastSyncResult && !lastSyncResult.success ? (
              <div>
                <p className="font-semibold">✅ Đã sắp xếp blocks thành công!</p>
                <p className="text-sm mt-1 text-yellow-600">
                  ⚠️ Thứ tự đã được cập nhật, nhưng đồng bộ dữ liệu thất bại: {lastSyncResult.error || 'Unknown error'}
                </p>
                <p className="text-sm mt-1 text-gray-600">
                  💡 Vui lòng click "Đồng bộ về Home Settings" để sync thủ công.
                </p>
              </div>
            ) : autoSyncEnabled ? (
              <div>
                <p className="font-semibold">✅ Đã sắp xếp blocks thành công!</p>
                <p className="text-sm mt-1 text-blue-600">
                  🔄 Đang đồng bộ dữ liệu sang Home Settings...
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">✅ Đã sắp xếp blocks thành công!</p>
                <p className="text-sm mt-1 text-yellow-600">
                  ⚠️ Dữ liệu chưa được đồng bộ. Bật "Tự động đồng bộ" hoặc click "Đồng bộ về Home Settings" để sync.
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Blocks List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Chưa có block nào. Hãy thêm block đầu tiên!</p>
              </CardContent>
            </Card>
          ) : (
            blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onEdit={() => {
                  setEditingBlock(block);
                  setIsEditorOpen(true);
                }}
                onDelete={() => handleDeleteBlock(block.id)}
                onToggleStatus={() => handleToggleStatus(block)}
              />
            ))
          )}
        </SortableContext>
      </DndContext>

      {/* Block Editor */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingBlock(null);
          }}
          onSave={handleSaveBlock}
        />
      )}
    </div>
  );
}

