/**
 * Web Vitals Analytics API
 * Collect and store web vitals metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimitPresets } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = await rateLimit(request, RateLimitPresets.api);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse metric
    const metric = await request.json();

    // Validate metric
    if (!metric.name || !metric.value) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }

    // In production, you can:
    // 1. Store in database
    // 2. Send to analytics service (Google Analytics, Datadog, etc.)
    // 3. Send to monitoring service (Sentry, LogRocket, etc.)
    
    // Example: Store in database (optional)
    // await prisma.webVitals.create({
    //   data: {
    //     name: metric.name,
    //     value: metric.value,
    //     rating: metric.rating,
    //     metricId: metric.id,
    //     navigationType: metric.navigationType,
    //     userAgent: request.headers.get('user-agent'),
    //     createdAt: new Date(),
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web vitals error:', error);
    return NextResponse.json(
      { error: 'Failed to log metric' },
      { status: 500 }
    );
  }
}
