# Hướng dẫn cấu hình Database Connection để tránh mất kết nối VPS

## Vấn đề
Ứng dụng thường xuyên mất kết nối với VPS, gây ra lỗi timeout và connection errors.

## Giải pháp

### 1. Cấu hình DATABASE_URL với Connection Pooling

Cập nhật file `.env` hoặc `.env.local` với DATABASE_URL có connection pool parameters:

```bash
# Format cơ bản
DATABASE_URL="postgresql://user:password@host:port/database"

# Format với connection pooling (KHUYẾN NGHỊ)
DATABASE_URL="postgresql://user:password@host:port/database?connection_limit=5&pool_timeout=20&connect_timeout=10"
```

### 2. Giải thích các tham số

- **connection_limit**: Số lượng connection tối đa trong pool
  - Khuyến nghị: `5` cho VPS nhỏ, `10` cho VPS lớn
  - Mặc định: Số CPU cores * 2 + 1
  
- **pool_timeout**: Thời gian chờ lấy connection từ pool (giây)
  - Khuyến nghị: `20` giây
  - Mặc định: `10` giây
  
- **connect_timeout**: Thời gian chờ kết nối mới (giây)
  - Khuyến nghị: `10` giây
  - Mặc định: `5` giây

### 3. Cấu hình cho các môi trường

#### Development (Local)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/database?connection_limit=3&pool_timeout=10&connect_timeout=5"
```

#### Production (VPS)
```bash
DATABASE_URL="postgresql://user:password@your-vps-ip:5432/database?connection_limit=5&pool_timeout=20&connect_timeout=10&sslmode=require"
```

### 4. SSL Configuration (nếu cần)

Nếu database yêu cầu SSL:
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&connection_limit=5&pool_timeout=20&connect_timeout=10"
```

Các giá trị `sslmode`:
- `disable`: Không dùng SSL
- `allow`: Cho phép SSL nhưng không bắt buộc
- `prefer`: Ưu tiên SSL nhưng fallback nếu không có
- `require`: Bắt buộc SSL (khuyến nghị cho production)

### 5. Monitoring và Health Checks

Sử dụng utility functions đã tạo:

```typescript
import { testConnection, getConnectionStats } from '@/lib/db/connection-pool';

// Test connection
const isConnected = await testConnection();

// Get connection stats
const stats = await getConnectionStats();
console.log('Database status:', stats);
```

### 6. Error Handling

Code đã được cập nhật với:
- ✅ Graceful shutdown handlers
- ✅ Connection retry logic
- ✅ Health check functions
- ✅ Connection pool configuration

### 7. Troubleshooting

#### Lỗi: "Connection timeout"
- Tăng `connect_timeout` lên 15-20 giây
- Kiểm tra firewall và network connectivity
- Kiểm tra database server có đang chạy không

#### Lỗi: "Too many connections"
- Giảm `connection_limit` xuống 3-5
- Kiểm tra số lượng connections hiện tại trong database
- Restart database server nếu cần

#### Lỗi: "Connection pool timeout"
- Tăng `pool_timeout` lên 20-30 giây
- Kiểm tra có query nào đang chạy quá lâu không
- Kiểm tra database performance

### 8. Best Practices

1. **Luôn sử dụng connection pooling** - không tạo connection mới cho mỗi request
2. **Set connection_limit phù hợp** - không quá cao để tránh quá tải VPS
3. **Monitor connection usage** - theo dõi số lượng connections đang sử dụng
4. **Implement retry logic** - tự động retry khi connection bị mất
5. **Graceful shutdown** - đóng connections đúng cách khi app tắt

### 9. Kiểm tra Connection Pool Status

Truy vấn PostgreSQL để xem số lượng connections:

```sql
-- Xem tất cả connections
SELECT count(*) FROM pg_stat_activity;

-- Xem connections theo database
SELECT datname, count(*) 
FROM pg_stat_activity 
GROUP BY datname;

-- Xem connections đang active
SELECT count(*) 
FROM pg_stat_activity 
WHERE state = 'active';
```

### 10. Cấu hình PostgreSQL (nếu có quyền)

Nếu bạn có quyền truy cập PostgreSQL server, có thể tăng `max_connections`:

```sql
-- Xem max_connections hiện tại
SHOW max_connections;

-- Tăng max_connections (nếu cần)
ALTER SYSTEM SET max_connections = 100;
```

Sau đó restart PostgreSQL server.

## Kết luận

Sau khi cấu hình đúng, ứng dụng sẽ:
- ✅ Giảm đáng kể lỗi mất kết nối
- ✅ Tự động retry khi connection bị mất
- ✅ Quản lý connection pool hiệu quả
- ✅ Graceful shutdown khi app tắt

