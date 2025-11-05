'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  EyeOff, 
  RefreshCw,
  Home,
  Sparkles,
  Settings,
  Image,
  Video,
  MapPin,
  Phone,
  FileText,
  Award,
  ShoppingCart,
  Plane,
  UtensilsCrossed,
  HelpCircle,
  Link2,
  Camera,
  Navigation,
  Globe,
  Layout,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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
import { RestaurantSectionEditor } from '@/components/admin/homepage-settings/RestaurantSectionEditor';
import { FAQSectionEditor } from '@/components/admin/homepage-settings/FAQSectionEditor';
import { SystemSettingsEditor } from '@/components/admin/homepage-settings/SystemSettingsEditor';
import { PricingSnapshotEditor } from '@/components/admin/homepage-settings/PricingSnapshotEditor';
import { HomestaySectionEditor } from '@/components/admin/homepage-settings/HomestaySectionEditor';
import { SocialProofEditor } from '@/components/admin/homepage-settings/SocialProofEditor';
import { FooterEditor } from '@/components/admin/homepage-settings/FooterEditor';

// Import preview components
import { GallerySection } from '@/components/home/gallery-section';

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

// Section categories with metadata
const sectionCategories = [
  {
    id: 'core',
    label: 'Nền tảng',
    icon: Layout,
    color: 'bg-blue-500',
    description: 'Sections cốt lõi của trang chủ',
    sections: [
      { id: 'hero', label: 'Hero Section', icon: Home, description: 'Tiêu đề chính, hình nền, CTA' },
      { id: 'about', label: 'Giới thiệu', icon: FileText, description: 'Nội dung về chúng tôi' },
      { id: 'features', label: 'Tính năng nổi bật', icon: Sparkles, description: '3 tính năng chính' },
      { id: 'seo', label: 'SEO & Meta', icon: Globe, description: 'Tối ưu SEO' },
    ],
  },
  {
    id: 'products',
    label: 'Sản phẩm & Dịch vụ',
    icon: ShoppingCart,
    color: 'bg-emerald-500',
    description: 'Quản lý sản phẩm và dịch vụ',
    sections: [
      { id: 'promotion', label: 'Khuyến mãi', icon: Sparkles, description: 'Ưu đãi đặc biệt' },
      { id: 'pricingSnapshot', label: 'Bảng Giá Tham Khảo', icon: ShoppingCart, description: 'Tổng hợp giá vé + tour' },
      { id: 'ticket', label: 'Vé tham quan', icon: ShoppingCart, description: 'Giá vé cổng' },
      { id: 'tours', label: 'Tour & Trải nghiệm', icon: Plane, description: 'Bảng giá tour' },
      { id: 'services', label: 'Dịch vụ nổi bật', icon: Award, description: 'Featured services' },
      { id: 'restaurant', label: 'Nhà hàng', icon: UtensilsCrossed, description: 'Thông tin nhà hàng' },
      { id: 'homestay', label: 'Homestay', icon: Home, description: 'Lưu trú homestay' },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung & Media',
    icon: Image,
    color: 'bg-purple-500',
    description: 'Quản lý nội dung và media',
    sections: [
      { id: 'gallery', label: 'Thư viện ảnh', icon: Camera, description: 'Gallery images' },
      { id: 'video', label: 'Video hướng dẫn', icon: Video, description: 'YouTube videos' },
      { id: 'posts', label: 'Bài viết mới', icon: FileText, description: 'Latest blog posts' },
      { id: 'certificates', label: 'Giấy phép', icon: Award, description: 'Certificates & licenses' },
      { id: 'policies', label: 'Chính sách', icon: Link2, description: 'Policy links' },
      { id: 'faq', label: 'Câu hỏi thường gặp', icon: HelpCircle, description: 'FAQ section' },
      { id: 'socialProof', label: 'Social Proof', icon: Award, description: 'Testimonials & reviews' },
    ],
  },
  {
    id: 'location',
    label: 'Vị trí & Chuyển đổi',
    icon: MapPin,
    color: 'bg-orange-500',
    description: 'Thông tin vị trí và CTA',
    sections: [
      { id: 'map', label: 'Bản đồ', icon: Navigation, description: 'Google Maps embed' },
      { id: 'cta', label: 'CTA Đặt tour', icon: Phone, description: 'Call-to-action' },
    ],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    icon: Settings,
    color: 'bg-gray-500',
    description: 'Cài đặt hệ thống',
    sections: [
      { id: 'system', label: 'Cài đặt hệ thống', icon: Settings, description: 'System settings' },
      { id: 'footer', label: 'Footer', icon: FileText, description: 'Footer của trang chủ' },
    ],
  },
];

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
  const [activeCategory, setActiveCategory] = useState<string>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('hero');

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
      
      if (data.config) {
        setConfig(data.config);
      } else {
        console.error('No config received from API');
        setConfig(null);
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
      
      // Always publish when saving
      const response = await fetch('/api/admin/homepage-settings-unified', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          seo,
          status: 'PUBLISHED', // Always publish
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      const result = await response.json();
      
      // Always set to PUBLISHED
      setHomepageStatus('PUBLISHED');

      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
      
      // Reload settings to get latest status
      await loadSettings();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  }

  // Get all sections (flattened)
  const allSections = useMemo(() => {
    return sectionCategories.flatMap(category => 
      category.sections.map(section => ({
        ...section,
        categoryId: category.id,
        categoryLabel: category.label,
        categoryIcon: category.icon,
      }))
    );
  }, []);

  // Get filtered sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return allSections;
    const query = searchQuery.toLowerCase();
    return allSections.filter(section =>
      section.label.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.categoryLabel.toLowerCase().includes(query)
    );
  }, [allSections, searchQuery]);

  // Get active sections based on category
  const activeSections = useMemo(() => {
    const category = sectionCategories.find(c => c.id === activeCategory);
    if (!category) return [];
    
    let sections = category.sections;
    
    if (searchQuery) {
      sections = sections.filter(s => 
        s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return sections;
  }, [activeCategory, searchQuery]);

  // Check if section is active
  const isSectionActive = (sectionId: string) => {
    if (!config) return false;
    
    const sectionMap: Record<string, boolean> = {
      hero: !!config.hero,
      about: !!config.about?.isActive,
      features: !!config.features?.features?.length,
      seo: !!seo,
      promotion: !!config.promotion?.isActive,
      pricingSnapshot: !!config.pricingSnapshot?.isActive,
      ticket: !!config.ticket,
      tours: !!config.tourPricing?.tours?.length,
      services: featuredServices.length > 0,
      restaurant: !!config.restaurant?.isActive,
      homestay: !!config.homestay?.isActive,
      gallery: !!config.gallery?.images?.length,
      video: !!config.videoGuide?.videos?.length,
      posts: !!config.latestPosts,
      certificates: !!config.certificates?.certificates?.length,
      policies: !!config.policyLinks?.links?.length,
      faq: !!config.faq?.isActive,
      socialProof: !!config.socialProof?.isActive,
      map: !!config.map,
      cta: !!config.ctaBooking,
      footer: !!config.footer?.isActive,
      system: true,
    };
    
    return sectionMap[sectionId] ?? false;
  };

  // Update active category when section changes
  useEffect(() => {
    const section = allSections.find(s => s.id === activeSection);
    if (section && section.categoryId !== activeCategory) {
      setActiveCategory(section.categoryId);
    }
  }, [activeSection, activeCategory, allSections]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải cấu hình. Vui lòng thử lại.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Status */}
      <div className="border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Home Settings</h1>
                <p className="text-muted-foreground">
                  Quản lý toàn bộ nội dung và cấu hình trang chủ
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-3 pt-2">
              <Badge 
                variant={homepageStatus === 'PUBLISHED' ? 'default' : 'secondary'}
                className="text-sm px-3 py-1"
              >
                {homepageStatus === 'PUBLISHED' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Đã xuất bản
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Bản nháp
                  </>
                )}
              </Badge>
              
              {status === 'success' && (
                <Badge variant="outline" className="text-sm px-3 py-1 border-green-500 text-green-700 bg-green-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã lưu thành công
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
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
              size="sm"
              onClick={() => void loadSettings()}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Tải lại
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem trang chủ
              </Link>
            </Button>
            
            <Button onClick={saveSettings} disabled={saving} size="sm" variant="default">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu và xuất bản...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Lưu và xuất bản
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {status === 'success' && (
        <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            ✅ Đã lưu và xuất bản thành công! Thay đổi đã hiển thị trên trang chủ.
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        {/* Sidebar Navigation */}
        <aside className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tìm kiếm Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {sectionCategories.map((category) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.id;
                const activeCount = category.sections.filter(s => isSectionActive(s.id)).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSearchQuery('');
                      if (category.sections.length > 0) {
                        setActiveSection(category.sections[0].id);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeCount > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                          {activeCount}/{category.sections.length}
                        </Badge>
                      )}
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        isActive && "rotate-90"
                      )} />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sections</CardTitle>
              <CardDescription className="text-xs">
                {filteredSections.length} sections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-500px)]">
                <div className="space-y-1 p-4">
                  {filteredSections.map((section) => {
                    const SectionIcon = section.icon;
                    const isActive = activeSection === section.id;
                    const isSectionEnabled = isSectionActive(section.id);
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setActiveCategory(section.categoryId);
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <SectionIcon className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          isActive && "text-primary-foreground"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              "font-medium truncate",
                              isActive && "text-primary-foreground"
                            )}>
                              {section.label}
                            </span>
                            {isSectionEnabled ? (
                              <Badge variant={isActive ? "secondary" : "outline"} className="h-5 px-1.5 text-xs shrink-0">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="h-5 px-1.5 text-xs shrink-0 text-muted-foreground border-dashed">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {!isActive && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Category Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const category = sectionCategories.find(c => c.id === activeCategory);
                    const CategoryIcon = category?.icon || Layout;
                    return (
                      <>
                        <div className={cn(
                          "p-2 rounded-lg",
                          category?.color || "bg-blue-500"
                        )}>
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>{category?.label || 'Danh mục'}</CardTitle>
                          <CardDescription>{category?.description || ''}</CardDescription>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <Badge variant="outline" className="text-sm">
                  {activeSections.filter(s => isSectionActive(s.id)).length} / {activeSections.length} active
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Sections Tabs */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="mb-4">
              <TabsList className="inline-flex flex-wrap h-auto w-full gap-2 p-1 bg-muted/50">
                {activeSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = isSectionActive(section.id);
                  const isSelected = activeSection === section.id;
                  
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className={cn(
                        "gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm relative",
                        isSelected && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{section.label}</span>
                      <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Render all TabsContent */}
            {/* Core Sections */}
            <TabsContent value="hero" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      <CardTitle>Hero Section</CardTitle>
                    </div>
                    {isSectionActive('hero') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Tiêu đề chính, hình nền, mô tả và các nút CTA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HeroEditor
                    data={config.hero}
                    onChange={(hero) => setConfig({ ...config, hero })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <CardTitle>Giới thiệu</CardTitle>
                    </div>
                    {isSectionActive('about') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Nội dung giới thiệu về khu du lịch
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                            ...(data.aboutTitle !== undefined && { title: data.aboutTitle ?? '' }),
                            ...(data.aboutContent !== undefined && { content: data.aboutContent ?? '' }),
                            ...(data.aboutImage !== undefined && { image: data.aboutImage || undefined }),
                            ...(data.aboutImageId !== undefined && { imageId: data.aboutImageId || undefined }),
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
                            title: data.aboutTitle ?? '',
                            content: data.aboutContent ?? '',
                            image: data.aboutImage ?? undefined,
                            imageId: data.aboutImageId ?? undefined,
                            isActive: true,
                          },
                        });
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      <CardTitle>SEO & Meta Tags</CardTitle>
                    </div>
                    {isSectionActive('seo') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Tối ưu hóa SEO cho trang chủ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SEOSectionEditor
                    data={seo || {}}
                    onChange={(data) => setSeo({ ...seo, ...data } as HomepageSEO)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <CardTitle>Tính năng nổi bật</CardTitle>
                    </div>
                    {isSectionActive('features') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Hiển thị 3 tính năng chính của dịch vụ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeaturesEditor
                    data={config.features}
                    onChange={(features) => setConfig({ ...config, features })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Sections */}
            <TabsContent value="promotion" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <CardTitle>Khuyến mãi đặc biệt</CardTitle>
                    </div>
                    {isSectionActive('promotion') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Ưu đãi và khuyến mãi nổi bật
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromotionSectionEditor
                    data={config.promotion}
                    onChange={(promotion) => setConfig({ ...config, promotion })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricingSnapshot" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <CardTitle>Bảng Giá Tham Khảo</CardTitle>
                    </div>
                    {isSectionActive('pricingSnapshot') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Tổng hợp giá vé và tour trong một section đẹp mắt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PricingSnapshotEditor
                    data={config.pricingSnapshot}
                    onChange={(pricingSnapshot) => setConfig({ ...config, pricingSnapshot })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ticket" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <CardTitle>Vé tham quan</CardTitle>
                    </div>
                    {isSectionActive('ticket') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Giá vé cổng và các dịch vụ bao gồm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TicketSectionEditor
                    data={config.ticket}
                    onChange={(ticket) => setConfig({ ...config, ticket })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tours" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5" />
                      <CardTitle>Tour & Trải nghiệm</CardTitle>
                    </div>
                    {isSectionActive('tours') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Bảng giá và thông tin các gói tour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TourPricingEditor
                    data={config.tourPricing}
                    onChange={(tourPricing) => setConfig({ ...config, tourPricing })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <CardTitle>Dịch vụ nổi bật</CardTitle>
                    </div>
                    {isSectionActive('services') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý các dịch vụ được highlight
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeaturedServicesEditor
                    services={featuredServices}
                    onChange={setFeaturedServices}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="restaurant" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5" />
                      <CardTitle>Nhà hàng</CardTitle>
                    </div>
                    {isSectionActive('restaurant') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Thông tin về nhà hàng trong khu du lịch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RestaurantSectionEditor
                    data={config.restaurant}
                    onChange={(restaurant) => setConfig({ ...config, restaurant })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homestay" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      <CardTitle>Homestay</CardTitle>
                    </div>
                    {isSectionActive('homestay') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý thông tin homestay và lưu trú
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HomestaySectionEditor
                    data={config.homestay}
                    onChange={(homestay) => setConfig({ ...config, homestay })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Sections */}
            <TabsContent value="gallery" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      <CardTitle>Thư viện ảnh</CardTitle>
                    </div>
                    {isSectionActive('gallery') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý hình ảnh trong gallery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GalleryEditor
                    data={config.gallery}
                    onChange={(gallery) => setConfig({ ...config, gallery })}
                  />
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    Xem trước cách Gallery Section sẽ hiển thị trên homepage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] w-full">
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-2 md:p-4">
                      <div className="min-w-[320px]">
                        <GallerySection 
                          data={config.gallery} 
                          className="mb-0 shadow-none p-4 md:p-6 scale-90 md:scale-100 origin-top"
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      <CardTitle>Video hướng dẫn</CardTitle>
                    </div>
                    {isSectionActive('video') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý các video YouTube
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoGuideEditor
                    data={config.videoGuide}
                    onChange={(videoGuide) => setConfig({ ...config, videoGuide })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <CardTitle>Bài viết mới nhất</CardTitle>
                    </div>
                    {isSectionActive('posts') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Cấu hình section hiển thị bài viết mới
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LatestPostsEditor
                    data={config.latestPosts}
                    onChange={(latestPosts) => setConfig({ ...config, latestPosts })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <CardTitle>Giấy phép & Chứng nhận</CardTitle>
                    </div>
                    {isSectionActive('certificates') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý các giấy phép và chứng nhận
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificatesEditor
                    data={config.certificates}
                    onChange={(certificates) => setConfig({ ...config, certificates })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-5 h-5" />
                      <CardTitle>Chính sách</CardTitle>
                    </div>
                    {isSectionActive('policies') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Các link chính sách ở footer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PolicyLinksEditor
                    data={config.policyLinks}
                    onChange={(policyLinks) => setConfig({ ...config, policyLinks })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      <CardTitle>Câu hỏi thường gặp</CardTitle>
                    </div>
                    {isSectionActive('faq') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý FAQ section
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FAQSectionEditor
                    data={config.faq}
                    onChange={(faq) => setConfig({ ...config, faq })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="socialProof" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <CardTitle>Social Proof</CardTitle>
                    </div>
                    {isSectionActive('socialProof') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý đánh giá và testimonials từ khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialProofEditor
                    data={config.socialProof}
                    onChange={(socialProof) => setConfig({ ...config, socialProof })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location & CTA */}
            <TabsContent value="map" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5" />
                      <CardTitle>Bản đồ</CardTitle>
                    </div>
                    {isSectionActive('map') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Google Maps embed và thông tin địa chỉ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapEditor
                    data={config.map}
                    onChange={(map) => setConfig({ ...config, map })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cta" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      <CardTitle>CTA Đặt tour</CardTitle>
                    </div>
                    {isSectionActive('cta') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Call-to-action section cuối trang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CTABookingEditor
                    data={config.ctaBooking}
                    onChange={(ctaBooking) => setConfig({ ...config, ctaBooking })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footer */}
            <TabsContent value="footer" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <CardTitle>Footer</CardTitle>
                    </div>
                    {isSectionActive('footer') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Quản lý footer của trang chủ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FooterEditor
                    data={config?.footer}
                    onChange={(data) => {
                      setConfig({ ...config, footer: data } as HomepageConfig);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      <CardTitle>Cài đặt hệ thống</CardTitle>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">
                      <Settings className="w-3 h-3 mr-1" />
                      System
                    </Badge>
                  </div>
                  <CardDescription>
                    Các cài đặt hệ thống và tiện ích
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemSettingsEditor />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Actions Bar (Sticky) */}
      <div className="sticky bottom-0 bg-background border-t py-4 shadow-lg -mx-6 px-6 z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            💡 <strong>Mẹo:</strong> Sử dụng sidebar bên trái để điều hướng nhanh giữa các sections
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => void loadSettings()}
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Tải lại
            </Button>
            <Button onClick={saveSettings} disabled={saving} variant="default" size="sm" className="min-w-[180px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu và xuất bản...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Lưu và xuất bản
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
