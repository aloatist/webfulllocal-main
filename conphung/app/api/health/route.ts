import { NextResponse } from 'next/server';
import { apiRoute } from '@/lib/api/api-wrapper';

/**
 * General health check endpoint
 * GET /api/health
 */
export const GET = apiRoute(
  async () => {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    });
  },
  {
    enableRetry: false,
    allowedMethods: ['GET'],
  }
);

