/**
 * Database Connection Pool Configuration
 * 
 * Cấu hình connection pooling để tránh mất kết nối VPS
 * 
 * Cách sử dụng trong DATABASE_URL:
 * postgresql://user:password@host:port/database?connection_limit=5&pool_timeout=20&connect_timeout=10
 * 
 * Parameters:
 * - connection_limit: Số lượng connection tối đa trong pool (mặc định: số CPU cores * 2 + 1)
 * - pool_timeout: Thời gian chờ lấy connection từ pool (giây, mặc định: 10)
 * - connect_timeout: Thời gian chờ kết nối mới (giây, mặc định: 5)
 * - schema: Schema name (nếu có)
 * - sslmode: SSL mode (require, prefer, disable)
 */

import { prisma } from '@/lib/prisma';

/**
 * Parse và validate DATABASE_URL với connection pool settings
 */
export function parseDatabaseUrl(url: string): {
  url: string;
  connectionLimit: number;
  poolTimeout: number;
  connectTimeout: number;
} {
  try {
    const urlObj = new URL(url);
    
    // Connection pool settings - tối ưu cho VPS
    // Giảm connection limit để tránh quá tải VPS
    const connectionLimit = parseInt(urlObj.searchParams.get('connection_limit') || '5');
    const poolTimeout = parseInt(urlObj.searchParams.get('pool_timeout') || '20');
    const connectTimeout = parseInt(urlObj.searchParams.get('connect_timeout') || '10');
    
    // Đảm bảo giá trị hợp lý
    const safeConnectionLimit = Math.max(1, Math.min(connectionLimit, 10)); // 1-10 connections
    const safePoolTimeout = Math.max(5, Math.min(poolTimeout, 30)); // 5-30 seconds
    const safeConnectTimeout = Math.max(5, Math.min(connectTimeout, 30)); // 5-30 seconds
    
    // Cập nhật URL với các giá trị đã validate
    urlObj.searchParams.set('connection_limit', safeConnectionLimit.toString());
    urlObj.searchParams.set('pool_timeout', safePoolTimeout.toString());
    urlObj.searchParams.set('connect_timeout', safeConnectTimeout.toString());
    
    return {
      url: urlObj.toString(),
      connectionLimit: safeConnectionLimit,
      poolTimeout: safePoolTimeout,
      connectTimeout: safeConnectTimeout,
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    return {
      url,
      connectionLimit: 5,
      poolTimeout: 20,
      connectTimeout: 10,
    };
  }
}

/**
 * Test database connection với retry logic
 */
export async function testConnection(maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1 as connected`;
      console.log('✅ Database connection successful');
      return true;
    } catch (error: any) {
      console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ All database connection attempts failed');
      }
    }
  }
  return false;
}

/**
 * Reconnect to database
 */
export async function reconnectDatabase(): Promise<boolean> {
  try {
    await prisma.$disconnect();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await testConnection();
  } catch (error) {
    console.error('Error reconnecting to database:', error);
    return false;
  }
}

/**
 * Get connection pool stats (nếu có)
 */
export async function getConnectionStats(): Promise<{
  connected: boolean;
  timestamp: Date;
}> {
  const connected = await testConnection(1);
  return {
    connected,
    timestamp: new Date(),
  };
}

