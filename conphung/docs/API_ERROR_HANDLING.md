# API Error Handling Guide

## Tổng quan

Dự án đã được tích hợp hệ thống xử lý lỗi tự động cho API routes, đặc biệt là các lỗi liên quan đến database connection.

## Features

### 1. Automatic Error Handling
- Tự động catch và format errors
- Trả về HTTP status codes phù hợp
- Error messages thân thiện với người dùng
- Chi tiết error trong development mode

### 2. Connection Retry Logic
- Tự động retry khi gặp connection errors
- Exponential backoff
- Configurable retry attempts

### 3. Database Query Wrapper
- Automatic retry cho database queries
- Connection error detection
- Health check utilities

## Cách sử dụng

### 1. Sử dụng API Route Wrapper

**Cách cũ (không được khuyến nghị):**
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

**Cách mới (được khuyến nghị):**
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiRoute, dbQuery } from '@/lib/api/api-wrapper';

export const GET = apiRoute(
  async (request: NextRequest) => {
    // dbQuery tự động retry nếu gặp connection error
    const users = await dbQuery((prisma) => 
      prisma.user.findMany()
    );
    
    return NextResponse.json(users);
  },
  {
    requireAuth: false, // Set true nếu cần authentication
    allowedMethods: ['GET'],
    enableRetry: true,
  }
);
```

### 2. Sử dụng Database Query Wrapper

```typescript
import { dbQuery } from '@/lib/api/api-wrapper';

// Thay vì:
const users = await prisma.user.findMany();

// Dùng:
const users = await dbQuery((prisma) => 
  prisma.user.findMany()
);
```

### 3. Custom Error Handling

```typescript
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api/error-handler';

export async function GET() {
  try {
    // Your code here
    return NextResponse.json({ data: 'success' });
  } catch (error) {
    // Tự động xử lý error
    return handleApiError(error);
  }
}
```

## Error Types

### Connection Errors
- **Code**: `CONNECTION_ERROR`
- **Status**: `503 Service Unavailable`
- **Auto Retry**: Có

### Database Timeout
- **Code**: `DATABASE_TIMEOUT`
- **Status**: `504 Gateway Timeout`
- **Auto Retry**: Có

### Validation Errors
- **Code**: `VALIDATION_ERROR`
- **Status**: `400 Bad Request`
- **Auto Retry**: Không

### Not Found
- **Code**: `RECORD_NOT_FOUND`
- **Status**: `404 Not Found`
- **Auto Retry**: Không

### Unique Constraint
- **Code**: `UNIQUE_CONSTRAINT_VIOLATION`
- **Status**: `409 Conflict`
- **Auto Retry**: Không

## Configuration

### Retry Options

```typescript
// Trong api-wrapper options
{
  enableRetry: true, // Enable/disable retry
  maxRetries: 3,     // Số lần retry (default: 3)
  delay: 1000,       // Delay giữa các retry (ms)
  exponentialBackoff: true, // Exponential backoff
}
```

### Database Query Options

```typescript
await dbQuery(
  (prisma) => prisma.user.findMany(),
  {
    maxRetries: 5, // Tùy chỉnh số lần retry
  }
);
```

## Best Practices

### 1. Luôn sử dụng apiRoute wrapper
```typescript
export const GET = apiRoute(handler, options);
```

### 2. Sử dụng dbQuery cho database operations
```typescript
const data = await dbQuery((prisma) => prisma.model.findMany());
```

### 3. Không catch errors thủ công (wrapper sẽ xử lý)
```typescript
// ❌ Không làm thế này
export const GET = apiRoute(async () => {
  try {
    // code
  } catch (error) {
    // wrapper đã xử lý rồi
  }
});

// ✅ Làm thế này
export const GET = apiRoute(async () => {
  // code - wrapper sẽ tự động catch errors
});
```

### 4. Sử dụng health check endpoints
```typescript
// Kiểm tra database health
GET /api/health/db

// General health check
GET /api/health
```

## Monitoring

### Health Check Endpoints

```bash
# General health
curl http://localhost:3000/api/health

# Database health
curl http://localhost:3000/api/health/db
```

### Response Format

**Health Check Success:**
```json
{
  "status": "healthy",
  "connected": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Database connection is healthy",
  "metrics": {
    "responseTime": 50,
    "queryTime": 10,
    "connectionCheck": true
  }
}
```

**Health Check Failed:**
```json
{
  "status": "unhealthy",
  "connected": false,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Database connection failed",
  "responseTime": 5000
}
```

## Troubleshooting

### Lỗi: "Database connection failed"
1. Kiểm tra DATABASE_URL trong `.env`
2. Kiểm tra database server có đang chạy không
3. Kiểm tra firewall và network connectivity
4. Xem logs để biết chi tiết lỗi

### Lỗi: "Request timeout"
1. Tăng timeout trong next.config.mjs
2. Kiểm tra database performance
3. Kiểm tra network latency
4. Xem có query nào chạy quá lâu không

### Lỗi: "Too many retries"
1. Kiểm tra connection pool settings
2. Giảm số lượng retries nếu cần
3. Kiểm tra database server capacity
4. Xem logs để biết lỗi cụ thể

## Migration Guide

### Migrate Existing API Routes

1. **Import wrapper:**
```typescript
import { apiRoute, dbQuery } from '@/lib/api/api-wrapper';
```

2. **Wrap handler:**
```typescript
// Before
export async function GET(request: NextRequest) {
  // code
}

// After
export const GET = apiRoute(async (request: NextRequest) => {
  // code
});
```

3. **Replace prisma calls:**
```typescript
// Before
const data = await prisma.model.findMany();

// After
const data = await dbQuery((prisma) => prisma.model.findMany());
```

4. **Remove manual error handling:**
```typescript
// Before
try {
  // code
} catch (error) {
  return NextResponse.json({ error: '...' }, { status: 500 });
}

// After
// Wrapper sẽ tự động xử lý
```

## Examples

Xem các file ví dụ:
- `/app/api/health/db/route.ts` - Health check với retry
- `/app/api/health/route.ts` - General health check
- `/lib/api/api-wrapper.ts` - Wrapper implementation
- `/lib/api/error-handler.ts` - Error handling logic

