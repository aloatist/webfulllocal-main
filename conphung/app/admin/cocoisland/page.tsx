'use client';

import { useCallback, useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CocoIslandConfig } from '@/lib/cocoisland/schema';
import { HeroEditor } from '@/components/admin/cocoisland/HeroEditor';
import { StayPerksEditor } from '@/components/admin/cocoisland/StayPerksEditor';
import { RoomShowcaseEditor } from '@/components/admin/cocoisland/RoomShowcaseEditor';
import { ExperiencesEditor } from '@/components/admin/cocoisland/ExperiencesEditor';
import { ServicesEditor } from '@/components/admin/cocoisland/ServicesEditor';
import { TestimonialsEditor } from '@/components/admin/cocoisland/TestimonialsEditor';
import { RestaurantEditor } from '@/components/admin/cocoisland/RestaurantEditor';
import { DiscoveryEditor } from '@/components/admin/cocoisland/DiscoveryEditor';
import { ContactEditor } from '@/components/admin/cocoisland/ContactEditor';
import { NewsletterEditor } from '@/components/admin/cocoisland/NewsletterEditor';
import Link from 'next/link';

type SaveState = "idle" | "saving" | "success" | "error";

export default function CocoIslandAdminPage() {
  const [config, setConfig] = useState<CocoIslandConfig | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cocoisland/sections", {
        method: "GET",
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error("Failed to load configuration");
      }

      const payload = (await response.json()) as { data: CocoIslandConfig };
      setConfig(payload.data);
    } catch (error) {
      console.error('Error loading config:', error);
      setError('Không thể tải cấu hình. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async () => {
    if (!config) return;

    setSaveState('saving');
    setError(null);
    try {
      const response = await fetch("/api/cocoisland/sections", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save configuration");
      }

      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveState('error');
      setError(error instanceof Error ? error.message : 'Lỗi khi lưu cấu hình');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  }, [config]);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không thể tải cấu hình</h2>
          <p className="text-muted-foreground mb-4">{error || 'Đã xảy ra lỗi khi tải dữ liệu'}</p>
          <Button onClick={loadConfig}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🏝️ Coco Island CMS</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý toàn bộ nội dung trang web như WordPress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cocoisland" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Xem trang
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadConfig()}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button
              size="sm"
              onClick={() => void saveConfig()}
              disabled={saveState === 'saving'}
              className="min-w-[120px]"
            >
              {saveState === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2" />
                  Đang lưu...
                </>
              ) : saveState === 'success' ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  ✓ Đã lưu
                </>
              ) : saveState === 'error' ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Lỗi
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && saveState !== 'saving' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {saveState === 'success' && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20">
          <AlertDescription className="text-green-800 dark:text-green-200">
            ✓ Đã lưu thành công! Thay đổi sẽ hiển thị trên trang web.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Dịch vụ</h3>
          <p className="text-3xl font-bold mt-2">{config.services?.services?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">dịch vụ đang hiển thị</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Đánh giá</h3>
          <p className="text-3xl font-bold mt-2">{config.testimonials?.testimonials?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">nhận xét khách hàng</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Ưu đãi</h3>
          <p className="text-3xl font-bold mt-2">{config.stayPerks?.items?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">ưu đãi phòng nghỉ</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Trạng thái</h3>
          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ● Active
          </Badge>
        </div>
      </div>

      {/* Section Editors */}
      <div className="space-y-6">
        <HeroEditor 
          data={config.hero} 
          onChange={(hero) => setConfig({ ...config, hero })} 
        />

        <StayPerksEditor 
          data={config.stayPerks} 
          onChange={(stayPerks) => setConfig({ ...config, stayPerks })} 
        />

        {config.roomShowcase && (
          <RoomShowcaseEditor 
            data={config.roomShowcase} 
            onChange={(roomShowcase) => setConfig({ ...config, roomShowcase })} 
          />
        )}

        {config.experiences && (
          <ExperiencesEditor 
            eyebrow={config.experiences.eyebrow}
            heading={config.experiences.heading}
            description={config.experiences.description}
            experiences={config.experiences.experiences}
            onChange={(eyebrow, heading, description, experiences) => setConfig({ 
              ...config, 
              experiences: { eyebrow, heading, description, experiences } 
            })} 
          />
        )}

        {config.restaurant && (
          <RestaurantEditor 
            data={config.restaurant} 
            onChange={(restaurant) => setConfig({ ...config, restaurant })} 
          />
        )}

        {config.discovery && (
          <DiscoveryEditor 
            data={config.discovery} 
            onChange={(discovery) => setConfig({ ...config, discovery })} 
          />
        )}

        {config.services && (
          <ServicesEditor 
            eyebrow={config.services.eyebrow}
            heading={config.services.heading}
            services={config.services.services}
            onChange={(data) => setConfig({ 
              ...config, 
              services: data 
            })} 
          />
        )}

        {config.testimonials && (
          <TestimonialsEditor 
            eyebrow={config.testimonials.eyebrow}
            heading={config.testimonials.heading}
            testimonials={config.testimonials.testimonials}
            onChange={(data) => setConfig({ 
              ...config, 
              testimonials: data 
            })} 
          />
        )}

        <ContactEditor 
          data={config.contact} 
          onChange={(contact) => setConfig({ ...config, contact })} 
        />

        {config.newsletter && (
          <NewsletterEditor 
            data={config.newsletter} 
            onChange={(newsletter) => setConfig({ ...config, newsletter })} 
          />
        )}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => void saveConfig()}
          disabled={saveState === 'saving'}
          className="shadow-lg"
        >
          {saveState === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current mr-2" />
              Đang lưu...
            </>
          ) : saveState === 'success' ? (
            <>
              <Save className="h-5 w-5 mr-2" />
              ✓ Đã lưu
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Lưu tất cả thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
