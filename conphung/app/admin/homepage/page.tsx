'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import type { HomepageConfig } from '@/lib/homepage/schema';
import HeroEditor from '@/components/admin/homepage/HeroEditor';
import FeaturesEditor from '@/components/admin/homepage/FeaturesEditor';
import CertificatesEditor from '@/components/admin/homepage/CertificatesEditor';
import PolicyLinksEditor from '@/components/admin/homepage/PolicyLinksEditor';
import PromotionSectionEditor from '@/components/admin/homepage/PromotionSectionEditor';
import TicketSectionEditor from '@/components/admin/homepage/TicketSectionEditor';
import TourPricingEditor from '@/components/admin/homepage/TourPricingEditor';
import GalleryEditor from '@/components/admin/homepage/GalleryEditor';
import MapEditor from '@/components/admin/homepage/MapEditor';
import VideoGuideEditor from '@/components/admin/homepage/VideoGuideEditor';
import LatestPostsEditor from '@/components/admin/homepage/LatestPostsEditor';
import CTABookingEditor from '@/components/admin/homepage/CTABookingEditor';

export default function HomepageCMSPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load config
  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage');
      
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

  async function saveConfig() {
    if (!config) return;

    try {
      setSaving(true);
      setStatus('idle');
      
      const response = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Error saving config:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu cấu hình');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🏠 Homepage CMS</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý toàn bộ nội dung trang chủ
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadConfig} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button onClick={saveConfig} disabled={saving} className="btn-gradient">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            ✅ Đã lưu thành công! Thay đổi sẽ hiển thị trên trang chủ.
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertDescription>
          💡 <strong>Hướng dẫn:</strong> Chọn section bạn muốn chỉnh sửa từ các tab bên dưới. 
          Thay đổi sẽ được lưu vào database và hiển thị ngay trên trang chủ.
        </AlertDescription>
      </Alert>

      {/* Content Tabs */}
      <Tabs defaultValue="hero" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
            <TabsTrigger value="ticket">Ticket</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
        </div>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <HeroEditor
            data={config.hero}
            onChange={(hero) => setConfig({ ...config, hero })}
          />
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-4">
          <FeaturesEditor
            data={config.features}
            onChange={(features) => setConfig({ ...config, features })}
          />
        </TabsContent>

        {/* Promotion Section */}
        <TabsContent value="promotion" className="space-y-4">
          <PromotionSectionEditor
            data={config.promotion}
            onChange={(promotion) => setConfig({ ...config, promotion })}
          />
        </TabsContent>

        {/* Ticket Section */}
        <TabsContent value="ticket" className="space-y-4">
          <TicketSectionEditor
            data={config.ticket}
            onChange={(ticket) => setConfig({ ...config, ticket })}
          />
        </TabsContent>

        {/* Tour Pricing Section */}
        <TabsContent value="tours" className="space-y-4">
          <TourPricingEditor
            data={config.tourPricing}
            onChange={(tourPricing) => setConfig({ ...config, tourPricing })}
          />
        </TabsContent>

        {/* Certificates Section */}
        <TabsContent value="certificates" className="space-y-4">
          <CertificatesEditor
            data={config.certificates}
            onChange={(certificates) => setConfig({ ...config, certificates })}
          />
        </TabsContent>

        {/* Policy Links Section */}
        <TabsContent value="policies" className="space-y-4">
          <PolicyLinksEditor
            data={config.policyLinks}
            onChange={(policyLinks) => setConfig({ ...config, policyLinks })}
          />
        </TabsContent>

        {/* Gallery Section */}
        <TabsContent value="gallery" className="space-y-4">
          <GalleryEditor
            data={config.gallery}
            onChange={(gallery) => setConfig({ ...config, gallery })}
          />
        </TabsContent>

        {/* Map Section */}
        <TabsContent value="map" className="space-y-4">
          <MapEditor
            data={config.map}
            onChange={(map) => setConfig({ ...config, map })}
          />
        </TabsContent>

        {/* Video Guide Section */}
        <TabsContent value="video" className="space-y-4">
          <VideoGuideEditor
            data={config.videoGuide}
            onChange={(videoGuide) => setConfig({ ...config, videoGuide })}
          />
        </TabsContent>

        {/* CTA Booking Section */}
        <TabsContent value="cta" className="space-y-4">
          <CTABookingEditor
            data={config.ctaBooking}
            onChange={(ctaBooking) => setConfig({ ...config, ctaBooking })}
          />
        </TabsContent>

        {/* Latest Posts Section */}
        <TabsContent value="posts" className="space-y-4">
          <LatestPostsEditor
            data={config.latestPosts}
            onChange={(latestPosts) => setConfig({ ...config, latestPosts })}
          />
        </TabsContent>
      </Tabs>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={saveConfig} disabled={saving} size="lg" className="btn-gradient">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
