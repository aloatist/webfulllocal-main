/**
 * Google Analytics 4 Integration
 * Track events, conversions, and user behavior
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics
 */
export function initGA() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Track booking event
 */
export function trackBooking(data: {
  bookingId: string;
  tourId: string;
  tourName: string;
  amount: number;
  currency: string;
  adults: number;
  children: number;
}) {
  trackEvent('booking_completed', 'Booking', data.tourName, data.amount);

  // Enhanced e-commerce tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: data.bookingId,
      value: data.amount,
      currency: data.currency,
      items: [
        {
          item_id: data.tourId,
          item_name: data.tourName,
          quantity: data.adults + data.children,
          price: data.amount,
        },
      ],
    });
  }
}

/**
 * Track payment event
 */
export function trackPayment(data: {
  paymentId: string;
  method: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed';
}) {
  trackEvent(
    `payment_${data.status}`,
    'Payment',
    data.method,
    data.amount
  );

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      payment_type: data.method,
      value: data.amount,
      currency: data.currency,
    });
  }
}

/**
 * Track search event
 */
export function trackSearch(query: string, category?: string) {
  trackEvent('search', 'Search', query);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      search_category: category,
    });
  }
}

/**
 * Track view item event
 */
export function trackViewItem(data: {
  itemId: string;
  itemName: string;
  itemCategory: string;
  price?: number;
}) {
  trackEvent('view_item', data.itemCategory, data.itemName, data.price);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      items: [
        {
          item_id: data.itemId,
          item_name: data.itemName,
          item_category: data.itemCategory,
          price: data.price,
        },
      ],
    });
  }
}

/**
 * Track add to wishlist
 */
export function trackAddToWishlist(data: {
  itemId: string;
  itemName: string;
  itemCategory: string;
}) {
  trackEvent('add_to_wishlist', data.itemCategory, data.itemName);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_wishlist', {
      items: [
        {
          item_id: data.itemId,
          item_name: data.itemName,
          item_category: data.itemCategory,
        },
      ],
    });
  }
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent(
    success ? 'form_submit_success' : 'form_submit_error',
    'Form',
    formName
  );
}

/**
 * Track contact event
 */
export function trackContact(method: 'phone' | 'email' | 'form' | 'chat') {
  trackEvent('contact', 'Contact', method);
}

/**
 * Track social share
 */
export function trackSocialShare(platform: string, url: string) {
  trackEvent('share', 'Social', platform);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      method: platform,
      content_type: 'page',
      item_id: url,
    });
  }
}

/**
 * Track file download
 */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent('download', 'File', fileName);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      file_name: fileName,
      file_extension: fileType,
    });
  }
}

/**
 * Track video play
 */
export function trackVideoPlay(videoTitle: string, videoUrl: string) {
  trackEvent('video_play', 'Video', videoTitle);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_start', {
      video_title: videoTitle,
      video_url: videoUrl,
    });
  }
}

/**
 * Track user engagement
 */
export function trackEngagement(action: string, details?: string) {
  trackEvent('engagement', 'User', action);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_type: action,
      engagement_details: details,
    });
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: {
  userId?: string;
  userType?: 'guest' | 'customer' | 'admin';
  language?: string;
  country?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  if (properties.userId) {
    window.gtag('set', 'user_id', properties.userId);
  }

  window.gtag('set', 'user_properties', {
    user_type: properties.userType,
    language: properties.language,
    country: properties.country,
  });
}

/**
 * Track exceptions/errors
 */
export function trackException(description: string, fatal: boolean = false) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
}
