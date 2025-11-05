import Image from 'next/image';
import Link from 'next/link';
import parseEditorContent from '@/lib/posts/parse-editor-content';
import { Button } from '@/components/ui/button';

interface HomepageData {
  settings: {
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    heroBackgroundImage?: string | null;
    aboutTitle?: string | null;
    aboutContent?: string | null; // EditorJS JSON string
    aboutImage?: string | null;
    ctaTitle?: string | null;
    ctaButtonText?: string | null;
    ctaButtonLink?: string | null;
  } | null;
  featuredServices: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    image?: string | null;
  }>;
}

// Hero Section Component
export function HeroSection({ data }: { data: HomepageData['settings'] }) {
  if (!data?.heroTitle) {
    // Fallback
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            DU LỊCH SINH THÁI CỒN PHỤNG
          </h1>
          <p className="text-xl md:text-2xl">
            KHÁM PHÁ THIÊN NHIÊN MIỀN TÂY
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative min-h-[60vh] flex items-center justify-center text-white"
      style={{
        backgroundImage: data.heroBackgroundImage 
          ? `url(${data.heroBackgroundImage})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          {data.heroTitle}
        </h1>
        {data.heroSubtitle && (
          <p className="text-xl md:text-2xl">
            {data.heroSubtitle}
          </p>
        )}
      </div>
    </section>
  );
}

// About Section Component
export function AboutSection({ data }: { data: HomepageData['settings'] }) {
  if (!data?.aboutTitle && !data?.aboutContent) {
    return null; // Don't render if no content
  }

  const contentBlocks = data.aboutContent 
    ? parseEditorContent(data.aboutContent)
    : null;

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className={`grid gap-8 items-center ${data.aboutImage ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {/* Image */}
          {data.aboutImage && (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.aboutImage}
                alt={data.aboutTitle || 'About'}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className={`space-y-4 ${!data.aboutImage ? 'max-w-4xl mx-auto' : ''}`}>
            {data.aboutTitle && (
              <h2 className="text-3xl font-bold">
                {data.aboutTitle}
              </h2>
            )}
            {contentBlocks && (
              <div className="prose prose-lg max-w-none">
                {contentBlocks.map((block, i) => {
                  if (block.type === 'paragraph') {
                    return <p key={i}>{block.data.text}</p>;
                  }
                  if (block.type === 'header') {
                    const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
                    return <Tag key={i}>{block.data.text}</Tag>;
                  }
                  if (block.type === 'list') {
                    const Tag = block.data.style === 'ordered' ? 'ol' : 'ul';
                    return (
                      <Tag key={i}>
                        {block.data.items.map((item: string, j: number) => (
                          <li key={j}>{item}</li>
                        ))}
                      </Tag>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Services Section
export function FeaturedServicesSection({ services }: { services: HomepageData['featuredServices'] }) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Dịch vụ nổi bật
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              {service.icon && (
                <div className="text-4xl mb-4">{service.icon}</div>
              )}
              {service.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
export function CTASection({ data }: { data: HomepageData['settings'] }) {
  if (!data?.ctaTitle && !data?.ctaButtonText) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        {data.ctaTitle && (
          <h2 className="text-3xl md:text-4xl font-bold">
            {data.ctaTitle}
          </h2>
        )}
        {data.ctaButtonText && (
          <Button
            asChild
            size="lg"
            variant="secondary"
          >
            <Link href={data.ctaButtonLink || '#'}>
              {data.ctaButtonText}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}

