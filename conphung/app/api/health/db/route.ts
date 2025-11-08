import { NextResponse } from 'next/server';
import { getConnectionStats, testConnection } from '@/lib/db/connection-pool';
import { apiRoute, dbQuery } from '@/lib/api/api-wrapper';

/**
 * Health check endpoint cho database connection
 * GET /api/health/db
 * 
 * Kiểm tra:
 * - Database connection status
 * - Connection pool health
 * - Response time
 */
export const GET = apiRoute(
  async () => {
    const startTime = Date.now();
    
    try {
      // Test connection với retry
      const isConnected = await testConnection(2);
      
      if (!isConnected) {
        return NextResponse.json(
          {
            status: 'unhealthy',
            connected: false,
            timestamp: new Date().toISOString(),
            message: 'Database connection failed',
            responseTime: Date.now() - startTime,
          },
          { status: 503 }
        );
      }

      // Test một query đơn giản
      const queryStart = Date.now();
      await dbQuery((prisma) => prisma.$queryRaw`SELECT 1`);
      const queryTime = Date.now() - queryStart;

      const stats = await getConnectionStats();
      const totalTime = Date.now() - startTime;

      return NextResponse.json({
        status: 'healthy',
        connected: true,
        timestamp: stats.timestamp.toISOString(),
        message: 'Database connection is healthy',
        metrics: {
          responseTime: totalTime,
          queryTime,
          connectionCheck: isConnected,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          status: 'error',
          connected: false,
          timestamp: new Date().toISOString(),
          message: error.message || 'Database health check failed',
          responseTime: Date.now() - startTime,
        },
        { status: 503 }
      );
    }
  },
  {
    enableRetry: false, // Không retry cho health check
    allowedMethods: ['GET'],
  }
);

