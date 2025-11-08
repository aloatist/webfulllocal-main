/**
 * API Route Wrapper
 * 
 * Wrapper utility để bọc API route handlers với:
 * - Error handling tự động
 * - Retry logic cho database operations
 * - Connection error handling
 * - Logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, withApiRetry } from './error-handler';
import { prismaWithRetry } from '@/lib/db/retry-wrapper';

type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

interface ApiWrapperOptions {
  requireAuth?: boolean;
  allowedMethods?: string[];
  enableRetry?: boolean;
}

/**
 * Wrapper cho API route handlers
 */
export function apiWrapper(
  handler: ApiHandler,
  options: ApiWrapperOptions = {}
): ApiHandler {
  const {
    requireAuth = false,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    enableRetry = true,
  } = options;

  return withErrorHandler(async (request: NextRequest, context?: any) => {
    // Check HTTP method
    const method = request.method;
    if (!allowedMethods.includes(method)) {
      return NextResponse.json(
        {
          message: `Method ${method} not allowed`,
          code: 'METHOD_NOT_ALLOWED',
          statusCode: 405,
        },
        { status: 405 }
      );
    }

    // Authentication check (nếu cần)
    if (requireAuth) {
      // TODO: Implement authentication check
      // const token = await getToken({ req: request });
      // if (!token) {
      //   return NextResponse.json(
      //     { message: 'Unauthorized', code: 'UNAUTHORIZED', statusCode: 401 },
      //     { status: 401 }
      //   );
      // }
    }

    // Execute handler với retry nếu enable
    if (enableRetry) {
      return await withApiRetry(() => handler(request, context));
    }

    return await handler(request, context);
  });
}

/**
 * Helper để tạo API route handler với wrapper
 * 
 * @example
 * export const GET = apiRoute(
 *   async (request: NextRequest) => {
 *     const data = await prisma.user.findMany();
 *     return NextResponse.json(data);
 *   },
 *   { requireAuth: true }
 * );
 */
export function apiRoute(
  handler: ApiHandler,
  options: ApiWrapperOptions = {}
) {
  return apiWrapper(handler, options);
}

/**
 * Helper để tạo database query với retry
 * 
 * @example
 * const users = await dbQuery((prisma) => prisma.user.findMany());
 */
export function dbQuery<T>(
  operation: (prisma: typeof import('@/lib/prisma').prisma) => Promise<T>,
  options: { maxRetries?: number } = {}
): Promise<T> {
  return prismaWithRetry(operation, {
    maxRetries: options.maxRetries || 3,
    delay: 1000,
    exponentialBackoff: true,
  });
}

