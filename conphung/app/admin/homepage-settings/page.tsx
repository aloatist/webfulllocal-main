'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Eye, Loader2, CheckCircle2, AlertCircle, EyeOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import type { HomepageConfig } from '@/lib/homepage/schema';

// Import all editors from old homepage CMS
import HeroEditor from '@/components/admin/homepage/HeroEditor';
import FeaturesEditor from '@/components/admin/homepage/FeaturesEditor';
import PromotionSectionEditor from '@/components/admin/homepage/PromotionSectionEditor';
import TicketSectionEditor from '@/components/admin/homepage/TicketSectionEditor';
import TourPricingEditor from '@/components/admin/homepage/TourPricingEditor';
import CertificatesEditor from '@/components/admin/homepage/CertificatesEditor';
import PolicyLinksEditor from '@/components/admin/homepage/PolicyLinksEditor';
import GalleryEditor from '@/components/admin/homepage/GalleryEditor';
import MapEditor from '@/components/admin/homepage/MapEditor';
import VideoGuideEditor from '@/components/admin/homepage/VideoGuideEditor';
import CTABookingEditor from '@/components/admin/homepage/CTABookingEditor';
import LatestPostsEditor from '@/components/admin/homepage/LatestPostsEditor';

// Import new editors
import { AboutSectionEditor } from '@/components/admin/homepage-settings/AboutSectionEditor';
import { SEOSectionEditor } from '@/components/admin/homepage-settings/SEOSectionEditor';
import { FeaturedServicesEditor } from '@/components/admin/homepage-settings/FeaturedServicesEditor';

// New editors
import { RestaurantSectionEditor } from '@/components/admin/homepage-settings/RestaurantSectionEditor';
import { FAQSectionEditor } from '@/components/admin/homepage-settings/FAQSectionEditor';

// System Settings
import { SystemSettingsEditor } from '@/components/admin/homepage-settings/SystemSettingsEditor';

interface HomepageSEO {
  id?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[];
  ogImage?: string | null;
  ogImageId?: string | null;
  canonicalUrl?: string | null;
  robotsMeta?: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  isFeatured: boolean;
  featuredOrder?: number | null;
  isActive: boolean;
}

export default function UnifiedHomepageSettingsPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [seo, setSeo] = useState<HomepageSEO | null>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [homepageStatus, setHomepageStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  useEffect(() => {
    void loadSettings();
  }, [previewMode]);

  async function loadSettings() {
    try {
      setLoading(true);
      const url = previewMode 
        ? '/api/admin/homepage-settings-unified?preview=true'
        : '/api/admin/homepage-settings-unified';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }
      
      const data = await response.json();
      
      // Use config from API or empty object (will be initialized)
      if (data.config) {
        setConfig(data.config);
      } else {
        // Initialize with minimal config structure
        setConfig({
          hero: {
            mainTitle: '',
            subtitle: '',
            description: '',
            backgroundImage: '',
            phone: '',
            address: '',
            openingHours: '',
            primaryCta: { text: '', link: '' },
            secondaryCta: { text: '', link: '' },
          },
          features: { features: [] },
          certificates: {
            eyebrow: '',
            heading: '',
            description: '',
            certificates: [],
            bottomNote: '',
          },
          policyLinks: { links: [] },
        } as HomepageConfig);
      }
      
      setSeo(data.seo);
      setFeaturedServices(data.featuredServices || []);
      setHomepageStatus(data.settings?.status || 'DRAFT');
      setStatus('idle');
    } catch (error) {
      console.error('Error loading settings:', error);
      setStatus('error');
      setErrorMessage('Không thể tải cấu hình');
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!config) return;

    try {
      setSaving(true);
      setStatus('idle');
      
      const response = await fetch('/api/admin/homepage-settings-unified', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          seo,
          status: homepageStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      
      await loadSettings();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  }

  function handlePublish() {
    setHomepageStatus('PUBLISHED');
    setTimeout(() => saveSettings(), 100);
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải cấu hình</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home Settings - Quản lý Toàn bộ Trang chủ</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý tất cả sections trên trang chủ - Hero, About, Promotion, Ticket, Tours, Gallery, Map, Video, CTA, SEO và nhiều hơn nữa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Tắt Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Bật Preview
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                setSaving(true);
                setStatus('idle');
                const response = await fetch('/api/admin/homepage-settings/migrate', {
                  method: 'POST',
                });
                if (response.ok) {
                  const data = await response.json();
                  setStatus('success');
                  setErrorMessage(`✅ Đã migrate ${data.migratedSections?.length || 0} sections thành công!`);
                  setTimeout(() => {
                    setStatus('idle');
                    void loadSettings();
                  }, 3000);
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
            }}
            disabled={saving || loading}
            title="Tải dữ liệu mẫu từ homepage hiện tại vào database"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Migrate Data
          </Button>
          <Button variant="outline" onClick={() => void loadSettings()} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          {homepageStatus === 'DRAFT' && (
            <Button onClick={handlePublish} variant="default">
              <Eye className="mr-2 h-4 w-4" />
              Xuất bản
            </Button>
          )}
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      <Alert>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Trạng thái: <strong>{homepageStatus === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}</strong>
          </span>
          <span className="text-xs text-muted-foreground">
            💡 Chưa có data? Click &ldquo;Migrate Data&rdquo; để tải dữ liệu từ homepage hiện tại
          </span>
        </AlertDescription>
      </Alert>

      {status === 'success' && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Đã lưu thành công!
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Unified Settings Tabs - Organized by Category */}
      <Tabs defaultValue="hero" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto h-auto flex-wrap">
            {/* Core Sections */}
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            
            {/* Product Sections */}
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
            <TabsTrigger value="ticket">Ticket</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            
            {/* Content Sections */}
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="posts">Latest Posts</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            
            {/* Location & CTA */}
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="cta">CTA Booking</TabsTrigger>
            
            {/* System Settings */}
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>

        {/* Core Sections */}
        <TabsContent value="hero" className="space-y-4">
          <HeroEditor
            data={config.hero}
            onChange={(hero) => setConfig({ ...config, hero })}
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          {config.about ? (
            <AboutSectionEditor
              data={{
                aboutTitle: config.about.title,
                aboutContent: config.about.content || null,
                aboutImage: config.about.image || null,
                aboutImageId: config.about.imageId || null,
              }}
              onChange={(data) => {
                setConfig({
                  ...config,
                  about: {
                    ...config.about!,
                    title: data.aboutTitle || '',
                    content: data.aboutContent || '',
                    image: data.aboutImage || undefined,
                    imageId: data.aboutImageId || undefined,
                    isActive: config.about?.isActive !== false,
                  },
                });
              }}
            />
          ) : (
            <AboutSectionEditor
              data={{}}
              onChange={(data) => {
                setConfig({
                  ...config,
                  about: {
                    title: data.aboutTitle || '',
                    content: data.aboutContent || '',
                    image: data.aboutImage || undefined,
                    imageId: data.aboutImageId || undefined,
                    isActive: true,
                  },
                });
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOSectionEditor
            data={seo || {}}
            onChange={(data) => setSeo({ ...seo, ...data } as HomepageSEO)}
          />
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <FeaturesEditor
            data={config.features}
            onChange={(features) => setConfig({ ...config, features })}
          />
        </TabsContent>

        {/* Product Sections */}
        <TabsContent value="promotion" className="space-y-4">
          <PromotionSectionEditor
            data={config.promotion}
            onChange={(promotion) => setConfig({ ...config, promotion })}
          />
        </TabsContent>

        <TabsContent value="ticket" className="space-y-4">
          <TicketSectionEditor
            data={config.ticket}
            onChange={(ticket) => setConfig({ ...config, ticket })}
          />
        </TabsContent>

        <TabsContent value="tours" className="space-y-4">
          <TourPricingEditor
            data={config.tourPricing}
            onChange={(tourPricing) => setConfig({ ...config, tourPricing })}
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <FeaturedServicesEditor
            services={featuredServices}
            onChange={setFeaturedServices}
          />
        </TabsContent>

        {/* Content Sections */}
        <TabsContent value="gallery" className="space-y-4">
          <GalleryEditor
            data={config.gallery}
            onChange={(gallery) => setConfig({ ...config, gallery })}
          />
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <VideoGuideEditor
            data={config.videoGuide}
            onChange={(videoGuide) => setConfig({ ...config, videoGuide })}
          />
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <LatestPostsEditor
            data={config.latestPosts}
            onChange={(latestPosts) => setConfig({ ...config, latestPosts })}
          />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <CertificatesEditor
            data={config.certificates}
            onChange={(certificates) => setConfig({ ...config, certificates })}
          />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <PolicyLinksEditor
            data={config.policyLinks}
            onChange={(policyLinks) => setConfig({ ...config, policyLinks })}
          />
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-4">
          <RestaurantSectionEditor
            data={config.restaurant}
            onChange={(restaurant) => setConfig({ ...config, restaurant })}
          />
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <FAQSectionEditor
            data={config.faq}
            onChange={(faq) => setConfig({ ...config, faq })}
          />
        </TabsContent>

        {/* Location & CTA */}
        <TabsContent value="map" className="space-y-4">
          <MapEditor
            data={config.map}
            onChange={(map) => setConfig({ ...config, map })}
          />
        </TabsContent>

        <TabsContent value="cta" className="space-y-4">
          <CTABookingEditor
            data={config.ctaBooking}
            onChange={(ctaBooking) => setConfig({ ...config, ctaBooking })}
          />
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <SystemSettingsEditor />
        </TabsContent>
      </Tabs>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={saveSettings} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

