'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye, RefreshCw, Home, ExternalLink, AlertCircle } from 'lucide-react';
import type { CocoIslandConfig } from '@/lib/cocoisland/schema';
import { HeroEditor } from '@/components/admin/cocoisland-cms/HeroEditor';
import { StayPerksEditor } from '@/components/admin/cocoisland-cms/StayPerksEditor';
import { RoomShowcaseEditor } from '@/components/admin/cocoisland-cms/RoomShowcaseEditor';
import { ExperiencesEditor } from '@/components/admin/cocoisland-cms/ExperiencesEditor';
import { RestaurantEditor } from '@/components/admin/cocoisland-cms/RestaurantEditor';
import { DiscoveryEditor } from '@/components/admin/cocoisland-cms/DiscoveryEditor';
import { TestimonialsEditor } from '@/components/admin/cocoisland-cms/TestimonialsEditor';
import { ServicesEditor } from '@/components/admin/cocoisland-cms/ServicesEditor';
import { ContactEditor } from '@/components/admin/cocoisland-cms/ContactEditor';

export default function CocoIslandCMSPage() {
  const [config, setConfig] = useState<CocoIslandConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  useEffect(() => {
    void loadSettings();
  }, [previewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSettings() {
    try {
      setLoading(true);
      const url = previewMode 
        ? '/api/admin/cocoisland-cms?preview=true'
        : '/api/admin/cocoisland-cms';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }
      
      const data = await response.json();
      
      if (data.config) {
        setConfig(data.config);
        setPublishStatus(data.settings?.status || 'DRAFT');
      } else {
        // No data yet - will show migrate button
        setConfig(null);
      }
      
      setStatus('idle');
    } catch (error) {
      console.error('Error loading settings:', error);
      setStatus('error');
      setErrorMessage('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publish = false) {
    try {
      setSaving(true);
      setStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/admin/cocoisland-cms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          status: publish ? 'PUBLISHED' : 'DRAFT',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      setStatus('success');
      setPublishStatus(publish ? 'PUBLISHED' : 'DRAFT');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu');
    } finally {
      setSaving(false);
    }
  }

  async function handleMigrate() {
    try {
      setSaving(true);
      setStatus('idle');
      
      const response = await fetch('/api/admin/cocoisland-cms/migrate', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setErrorMessage(`✅ Đã migrate ${data.migratedSections?.length || 0} sections thành công!`);
        setTimeout(() => {
          setStatus('idle');
          void loadSettings();
        }, 2000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Migration failed');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Không thể migrate dữ liệu');
    } finally {
      setSaving(false);
    }
  }

  const updateSection = <K extends keyof CocoIslandConfig>(
    section: K,
    data: CocoIslandConfig[K]
  ) => {
    setConfig((prev) => prev ? ({ ...prev, [section]: data }) : null);
  };

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Home className="w-8 h-8 text-emerald-600" />
            Coco Island CMS
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý nội dung trang Coco Island Homestay
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
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
            onClick={() => void loadSettings()}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>

          <Button
            variant="outline"
            onClick={handleMigrate}
            disabled={saving || loading}
            title="Tải dữ liệu mẫu từ cocoisland/data.ts"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Migrate Data
          </Button>

          <Button
            onClick={() => handleSave(false)}
            disabled={saving || !config}
            size="sm"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu Nháp
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={saving || !config}
            className="bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            Xuất Bản
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {status === 'success' && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
          <AlertDescription>
            <p className="text-green-800 dark:text-green-200">{errorMessage || '✅ Đã lưu thành công!'}</p>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30">
          <AlertDescription>
            <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs for Each Section */}
      {config ? (
        <Tabs defaultValue="hero" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-auto h-auto flex-wrap">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="perks">Stay Perks</TabsTrigger>
              <TabsTrigger value="rooms">Room Showcase</TabsTrigger>
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="discovery">Discovery</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="hero">
              <HeroEditor 
                data={config.hero} 
                onChange={(data) => updateSection('hero', data)} 
              />
            </TabsContent>

            <TabsContent value="perks">
              <StayPerksEditor 
                data={config.stayPerks} 
                onChange={(data) => updateSection('stayPerks', data)} 
              />
            </TabsContent>

            <TabsContent value="rooms">
              {config.roomShowcase ? (
                <RoomShowcaseEditor 
                  data={config.roomShowcase} 
                  onChange={(data) => updateSection('roomShowcase', data)} 
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Room Showcase</CardTitle>
                    <CardDescription>
                      Chưa có dữ liệu. Thêm section này vào config.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => updateSection('roomShowcase', {})}>
                      Tạo Room Showcase
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="experiences">
              <ExperiencesEditor 
                data={config.experiences} 
                onChange={(data) => updateSection('experiences', data)} 
              />
            </TabsContent>

            <TabsContent value="restaurant">
              <RestaurantEditor 
                data={config.restaurant} 
                onChange={(data) => updateSection('restaurant', data)} 
              />
            </TabsContent>

            <TabsContent value="discovery">
              <DiscoveryEditor 
                data={config.discovery} 
                onChange={(data) => updateSection('discovery', data)} 
              />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsEditor 
                data={config.testimonials} 
                onChange={(data) => updateSection('testimonials', data)} 
              />
            </TabsContent>

            <TabsContent value="services">
              <ServicesEditor 
                data={config.services} 
                onChange={(data) => updateSection('services', data)} 
              />
            </TabsContent>

            <TabsContent value="contact">
              <ContactEditor 
                data={config.contact} 
                onChange={(data) => updateSection('contact', data)} 
              />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Chưa có dữ liệu</CardTitle>
            <CardDescription>
              Click &ldquo;Migrate Data&rdquo; để tải dữ liệu mẫu từ cocoisland page hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleMigrate} disabled={saving}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tải Dữ Liệu Mẫu
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Floating Save Button */}
      {config && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={() => handleSave(publishStatus === 'PUBLISHED')}
            disabled={saving}
            className="shadow-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Lưu tất cả thay đổi
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}


