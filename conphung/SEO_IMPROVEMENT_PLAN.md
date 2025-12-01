# Implementation Plan: Cải Thiện SEO

## Mục Tiêu

1. **FAQPage Schema**: Verify và đảm bảo schema được render
2. **Nginx Optimization**: Bật compression và caching

## Proposed Changes

### 1. Verify FAQPage Schema
- Kiểm tra `/app/page.tsx` có sử dụng component `FAQ` (đã có schema)
- Nếu chưa: Update để sử dụng component từ `/components/schema/FAQSchema.tsx`

### 2. Nginx Compression

**File**: `/etc/nginx/nginx.conf`

Uncomment và optimize:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/javascript application/json text/xml application/xml image/svg+xml;
```

### 3. Cache Headers

**File**: `/etc/nginx/sites-enabled/conphungtourist.com.conf`

Thêm:
```nginx
# Images
location ~* \.(jpg|jpeg|png|gif|ico|webp|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# CSS/JS
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Verification Plan

### 1. FAQPage Schema
```bash
curl -s https://conphungtourist.com | grep '"@type":"FAQPage"'
```
Expected: Thấy FAQPage schema

### 2. Compression
```bash
curl -H "Accept-Encoding: gzip" -I https://conphungtourist.com
```
Expected: `Content-Encoding: gzip`

### 3. Cache Headers
```bash
curl -I https://conphungtourist.com/uploads/[image].webp
```
Expected: `Cache-Control: public, immutable`

### 4. Performance
```bash
npx lighthouse https://conphungtourist.com --only-categories=performance
```
Expected: Score > 90

## Rollback
```bash
sudo cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx
```
