'use client';

import { useCallback, useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CocoIslandConfig } from '@/lib/cocoisland/schema';

type SaveState = "idle" | "saving" | "success" | "error";

export default function CocoIslandAdminPage() {
  const [config, setConfig] = useState<CocoIslandConfig | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cocoisland/sections", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to load configuration");
      }

      const payload = (await response.json()) as { data: CocoIslandConfig };
      setConfig(payload.data);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async () => {
    if (!config) return;

    setSaveState('saving');
    try {
      const response = await fetch("/api/cocoisland/sections", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  }, [config]);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coco Island Settings</h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình trang web Coco Island
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadConfig()}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Làm mới
          </Button>
          <Button
            onClick={() => void saveConfig()}
            disabled={saveState === 'saving'}
          >
            {saveState === 'saving' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2" aria-hidden="true" />
                Đang lưu...
              </>
            ) : saveState === 'success' ? (
              <>
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                Đã lưu
              </>
            ) : saveState === 'error' ? (
              <>
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                Lỗi
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Hero Title</h3>
          </div>
          <p className="text-2xl font-bold">{config?.hero?.title || 'Chưa cấu hình'}</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Services</h3>
          </div>
          <p className="text-2xl font-bold">{config?.services?.length || 0}</p>
          <p className="text-xs text-muted-foreground">dịch vụ</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium">About Images</h3>
          </div>
          <p className="text-2xl font-bold">{config?.about?.images?.length || 0}</p>
          <p className="text-xs text-muted-foreground">hình ảnh</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Status</h3>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        </div>
      </div>

      {/* Configuration Preview */}
      <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Cấu hình hiện tại</h2>
          <p className="text-sm text-muted-foreground">
            Xem trước các thiết lập hiện tại của Coco Island
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Hero Section</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Title:</strong> {config?.hero?.title}</p>
              <p><strong>Subtitle:</strong> {config?.hero?.subtitle}</p>
              <p><strong>CTA:</strong> {config?.hero?.ctaText} → {config?.hero?.ctaLink}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">About Section</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Title:</strong> {config?.about?.title}</p>
              <p className="mt-2">{config?.about?.content}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Services ({config?.services?.length})</h3>
            <div className="space-y-2">
              {config?.services?.map((service, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg">
                  <p><strong>{service.icon} {service.title}</strong></p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              )) || <p className="text-muted-foreground">Chưa có dịch vụ nào</p>}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Contact Info</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Phone:</strong> {config?.contact?.phone}</p>
              <p><strong>Email:</strong> {config?.contact?.email}</p>
              <p><strong>Address:</strong> {config?.contact?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Trang quản lý Coco Island đang trong quá trình phát triển.
        Vui lòng liên hệ admin để cập nhật cấu hình.
      </div>
    </div>
  );
}
