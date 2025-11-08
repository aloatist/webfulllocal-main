/**
 * API Error Handler
 * 
 * Utility functions để xử lý errors trong API routes,
 * đặc biệt là database connection errors
 */

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { isConnectionError } from '@/lib/db/retry-wrapper';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}

/**
 * Xác định loại error và trả về response phù hợp
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json(
      {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR',
        statusCode: 500,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        message: 'Invalid data provided',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 400 }
    );
  }

  // Connection errors
  if (isConnectionError(error)) {
    return NextResponse.json(
      {
        message: 'Database connection failed. Please try again.',
        code: 'CONNECTION_ERROR',
        statusCode: 503,
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 503 }
    );
  }

  // Standard Error
  if (error instanceof Error) {
    // Check if it's a known error type
    if (error.message.includes('timeout')) {
      return NextResponse.json(
        {
          message: 'Request timeout. Please try again.',
          code: 'TIMEOUT_ERROR',
          statusCode: 504,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        message: error.message || 'An error occurred',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    },
    { status: 500 }
  );
}

/**
 * Xử lý Prisma known errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse<ApiError> {
  switch (error.code) {
    case 'P1001':
      // Can't reach database server
      return NextResponse.json(
        {
          message: 'Database server is unreachable. Please try again later.',
          code: 'DATABASE_UNREACHABLE',
          statusCode: 503,
        },
        { status: 503 }
      );

    case 'P1008':
      // Operations timed out
      return NextResponse.json(
        {
          message: 'Database operation timed out. Please try again.',
          code: 'DATABASE_TIMEOUT',
          statusCode: 504,
        },
        { status: 504 }
      );

    case 'P1017':
      // Server has closed the connection
      return NextResponse.json(
        {
          message: 'Database connection was closed. Please try again.',
          code: 'DATABASE_CONNECTION_CLOSED',
          statusCode: 503,
        },
        { status: 503 }
      );

    case 'P2002':
      // Unique constraint violation
      return NextResponse.json(
        {
          message: 'A record with this information already exists',
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          statusCode: 409,
          details: error.meta,
        },
        { status: 409 }
      );

    case 'P2025':
      // Record not found
      return NextResponse.json(
        {
          message: 'Record not found',
          code: 'RECORD_NOT_FOUND',
          statusCode: 404,
        },
        { status: 404 }
      );

    case 'P2003':
      // Foreign key constraint violation
      return NextResponse.json(
        {
          message: 'Related record not found',
          code: 'FOREIGN_KEY_VIOLATION',
          statusCode: 400,
          details: error.meta,
        },
        { status: 400 }
      );

    default:
      return NextResponse.json(
        {
          message: 'Database operation failed',
          code: `PRISMA_${error.code}`,
          statusCode: 500,
          details: process.env.NODE_ENV === 'development' ? error.meta : undefined,
        },
        { status: 500 }
      );
  }
}

/**
 * Wrapper để handle errors trong API route handlers
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  }) as T;
}

/**
 * Async wrapper với retry logic cho database operations
 */
export async function withApiRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Chỉ retry connection errors
      if (!isConnectionError(error) || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = 1000 * Math.pow(2, attempt - 1);
      console.warn(
        `API operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

