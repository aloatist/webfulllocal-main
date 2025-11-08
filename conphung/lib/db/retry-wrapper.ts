/**
 * Database Retry Wrapper
 * 
 * Wrapper function để tự động retry database operations khi mất kết nối
 */

import { prisma } from '@/lib/prisma';
import { reconnectDatabase } from './connection-pool';

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  exponentialBackoff?: boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  exponentialBackoff: true,
};

/**
 * Kiểm tra xem error có phải là connection error không
 */
export function isConnectionError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';
  
  // PostgreSQL connection error codes
  const connectionErrorCodes = [
    'econnrefused',
    'etimedout',
    'enotfound',
    'econnreset',
    'epipe',
    'p1001', // Prisma connection error
    'p1008', // Prisma operation timeout
    'p1017', // Prisma server closed connection
  ];
  
  // Connection error messages
  const connectionErrorMessages = [
    'connection',
    'timeout',
    'network',
    'econnrefused',
    'etimedout',
    'server closed',
    'connection closed',
    'lost connection',
  ];
  
  return (
    connectionErrorCodes.some(code => errorCode.includes(code)) ||
    connectionErrorMessages.some(msg => errorMessage.includes(msg))
  );
}

/**
 * Wrapper function để retry database operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  
  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Chỉ retry nếu là connection error
      if (!isConnectionError(error)) {
        throw error;
      }
      
      // Nếu không phải lần thử cuối, retry
      if (attempt < opts.maxRetries) {
        const delay = opts.exponentialBackoff 
          ? opts.delay * Math.pow(2, attempt - 1)
          : opts.delay;
        
        console.warn(
          `Database connection error (attempt ${attempt}/${opts.maxRetries}): ${error.message}. Retrying in ${delay}ms...`
        );
        
        // Thử reconnect trước khi retry
        if (attempt === 1) {
          try {
            await reconnectDatabase();
          } catch (reconnectError) {
            console.error('Failed to reconnect:', reconnectError);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Nếu tất cả retries đều fail
  console.error(`Database operation failed after ${opts.maxRetries} attempts:`, lastError);
  throw lastError;
}

/**
 * Wrapper cho Prisma queries với retry logic
 */
export function prismaWithRetry<T>(
  operation: (client: typeof prisma) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return withRetry(() => operation(prisma), options);
}

/**
 * Ví dụ sử dụng:
 * 
 * // Thay vì:
 * const users = await prisma.user.findMany();
 * 
 * // Dùng:
 * const users = await prismaWithRetry(
 *   (prisma) => prisma.user.findMany(),
 *   { maxRetries: 3, delay: 1000 }
 * );
 */

