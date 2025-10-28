/**
 * i18n Configuration
 * Multi-language support with next-intl
 */

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['vi', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'vi';

// Locale names
export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
};

// Locale flags
export const localeFlags: Record<Locale, string> = {
  vi: '🇻🇳',
  en: '🇬🇧',
  zh: '🇨🇳',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (locale === defaultLocale) return pathname;
  
  return pathname.replace(`/${locale}`, '') || '/';
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) return pathname;
  
  const cleanPath = removeLocaleFromPathname(pathname);
  return `/${locale}${cleanPath}`;
}
