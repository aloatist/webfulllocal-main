import { MetadataRoute } from 'next'
import { siteConfig } from '@/site.config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/login',
        '/_next/',
        '/private/',
        '/cocoisland/',
      ],
    },
    sitemap: `${siteConfig.site_domain}/sitemap.xml`,
  }
}
