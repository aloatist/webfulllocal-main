# Facebook to Next.js Post Import - Setup Guide

## Tổng quan

Workflow n8n tự động hóa việc import bài viết từ Facebook Page về website Next.js. Workflow sẽ:

1. **Lấy bài viết từ Facebook** (chạy định kỳ mỗi 15 phút)
2. **Kiểm tra duplicate** - Tránh import lại bài viết đã có
3. **Upload ảnh lên Cloudinary** - Tự động download và upload ảnh từ Facebook
4. **Chuyển đổi text → Markdown** - Format lại nội dung cho website
5. **Extract hashtags → Tags** - Tạo tags từ hashtags trong bài viết
6. **Tạo post trong Next.js** - Lưu bài viết vào database với status DRAFT

## Yêu cầu hệ thống

### 1. Facebook App Setup

1. **Tạo Facebook App**:
   - Truy cập [Facebook Developers](https://developers.facebook.com/)
   - Tạo app mới hoặc chọn app hiện có
   - Thêm **Facebook Login** và **Page Public Content Access** products

2. **Lấy Page Access Token**:
   - Vào **Tools** → **Graph API Explorer**
   - Chọn app và page của bạn
   - Generate **Page Access Token** với các permissions:
     - `pages_read_engagement`
     - `pages_read_user_content`
     - `pages_show_list`
     - `public_profile`

3. **Lấy Page ID**:
   - Vào trang Facebook của bạn
   - Vào **About** → **Page ID** (hoặc dùng Graph API Explorer)

### 2. Next.js API Setup

1. **Environment Variables**:
   Thêm vào `.env` file:
   ```bash
   # Facebook
   FACEBOOK_PAGE_ID=your_page_id_here
   FACEBOOK_ACCESS_TOKEN=your_page_access_token_here
   
   # Next.js API
   NEXTJS_API_URL=http://localhost:3000
   NEXTJS_API_KEY=your_secret_api_key_here
   
   # n8n
   N8N_WEBHOOK_SECRET=your_n8n_webhook_secret_here
   
   # Cloudinary (đã có sẵn)
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

2. **API Key Authentication**:
   - Tạo API key mạnh (ví dụ: `openssl rand -hex 32`)
   - Lưu vào `NEXTJS_API_KEY` trong `.env`
   - n8n sẽ dùng API key này để authenticate

### 3. n8n Setup

1. **Cài đặt n8n**:
   ```bash
   # Nếu chưa có n8n
   npm install -g n8n
   # hoặc
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **Import Workflow**:
   - Mở n8n dashboard: `http://localhost:5678`
   - Click **Workflows** → **Import from File**
   - Chọn file `facebook-to-nextjs-post.json`
   - Workflow sẽ được import với tất cả nodes

3. **Cấu hình Credentials**:

   a. **Facebook Graph API**:
   - Vào **Credentials** → **Add Credential**
   - Chọn **Facebook Graph API**
   - Điền:
     - **App ID**: Facebook App ID
     - **App Secret**: Facebook App Secret
     - **Access Token**: Page Access Token (long-lived)
   - Lưu với tên: `Facebook Page API`

   b. **Next.js API (HTTP Header Auth)**:
   - Vào **Credentials** → **Add Credential**
   - Chọn **HTTP Header Auth**
   - Điền:
     - **Name**: `Authorization`
     - **Value**: `Bearer YOUR_API_KEY`
   - Lưu với tên: `Next.js API`

4. **Cấu hình Environment Variables trong n8n**:
   - Vào **Settings** → **Environment Variables**
   - Thêm các biến:
     ```
     FACEBOOK_PAGE_ID=your_page_id
     NEXTJS_API_URL=http://localhost:3000
     NEXTJS_API_KEY=your_api_key
     N8N_WEBHOOK_SECRET=your_secret
     FACEBOOK_POSTS_LIMIT=10
     ```

5. **Activate Workflow**:
   - Mở workflow đã import
   - Click **Active** toggle để kích hoạt
   - Workflow sẽ chạy tự động mỗi 15 phút

## Workflow Nodes Chi tiết

### 1. Cron Trigger
- **Schedule**: Mỗi 15 phút
- **Config**: Có thể thay đổi trong node settings

### 2. Get Facebook Posts
- **Resource**: Page Posts
- **Fields**: id, message, created_time, full_picture, attachments, permalink_url
- **Limit**: 10 posts mỗi lần (có thể config)

### 3. Split Posts
- Chia posts thành từng item riêng biệt để xử lý

### 4. Filter Empty Posts
- Lọc bỏ posts không có message hoặc story

### 5. Check Duplicate
- Gọi API `/api/integrations/facebook/check-duplicate`
- Kiểm tra xem post đã tồn tại chưa

### 6. Process Images
- Extract URLs từ Facebook post
- Chuẩn bị để upload (Next.js API sẽ xử lý upload)

### 7. Text to Markdown
- Chuyển đổi text thành Markdown format
- Extract hashtags

### 8. Create Post in Next.js
- Gọi API `/api/integrations/facebook/import`
- API sẽ:
  - Upload ảnh lên Cloudinary
  - Tạo tags từ hashtags
  - Tạo post trong database

### 9. Log Success/Error
- Ghi log vào Next.js API để tracking

## Testing

### 1. Test Manual Execution

1. **Disable Cron Trigger** (tạm thời):
   - Deactivate workflow
   - Hoặc comment out Cron node

2. **Test với 1 post**:
   - Click **Execute Workflow**
   - Workflow sẽ chạy và import post

3. **Check Results**:
   - Vào Next.js admin panel
   - Kiểm tra posts mới được tạo
   - Verify images được upload
   - Verify tags được tạo

### 2. Test API Endpoints

```bash
# Test duplicate check
curl -X POST http://localhost:3000/api/integrations/facebook/check-duplicate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "facebookPostId": "123456789",
    "permalink": "https://facebook.com/..."
  }'

# Test import
curl -X POST http://localhost:3000/api/integrations/facebook/import \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "facebookPost": {
      "id": "123456789",
      "message": "Test post #test #hashtag",
      "created_time": "2025-01-27T00:00:00Z",
      "permalink_url": "https://facebook.com/..."
    },
    "status": "DRAFT"
  }'
```

### 3. Test Error Handling

- Test với invalid Facebook token
- Test với network error
- Test với duplicate post
- Test với post không có ảnh

## Troubleshooting

### 1. Facebook API Errors

**Error: Invalid Access Token**
- Kiểm tra token có còn hiệu lực không
- Generate lại Page Access Token
- Đảm bảo token có đủ permissions

**Error: Rate Limit**
- Facebook có rate limit (600 requests/600 seconds)
- Giảm frequency của cron trigger
- Giảm số lượng posts mỗi lần fetch

### 2. Next.js API Errors

**Error: Unauthorized**
- Kiểm tra `NEXTJS_API_KEY` trong n8n và Next.js
- Đảm bảo header `X-API-Key` được gửi đúng

**Error: Duplicate Post**
- Post đã tồn tại trong database
- Workflow sẽ skip post này (expected behavior)

**Error: Image Upload Failed**
- Kiểm tra Cloudinary credentials
- Kiểm tra network connectivity
- Verify image URLs từ Facebook có accessible không

### 3. n8n Workflow Errors

**Error: Workflow không chạy**
- Kiểm tra workflow đã activate chưa
- Kiểm tra cron trigger settings
- Xem execution logs trong n8n

**Error: Code Node Errors**
- Kiểm tra JavaScript syntax trong Code nodes
- Verify data structure từ Facebook API
- Check console logs trong n8n

## Customization

### 1. Thay đổi Schedule

Sửa Cron Trigger node:
```json
{
  "rule": {
    "interval": [{
      "field": "minutes",
      "minutesInterval": 30  // Thay đổi thành 30 phút
    }]
  }
}
```

### 2. Thay đổi Post Status

Sửa "Create Post in Next.js" node:
```json
{
  "status": "PUBLISHED"  // Thay vì "DRAFT"
}
```

### 3. Filter Posts

Thêm filter node để chỉ import posts có:
- Hashtags cụ thể
- Keywords cụ thể
- Date range cụ thể

### 4. Notification

Thêm Telegram/Email notification node để nhận thông báo khi:
- Post được import thành công
- Có lỗi xảy ra
- Duplicate post được phát hiện

## Security

### 1. API Key Security

- **Never commit** API keys vào git
- Sử dụng environment variables
- Rotate keys định kỳ
- Sử dụng different keys cho dev/staging/production

### 2. Facebook Token Security

- Sử dụng **long-lived tokens** (60 days)
- Setup **token refresh** workflow
- Store tokens securely (encrypted)

### 3. Rate Limiting

- Implement rate limiting trong Next.js API
- Monitor Facebook API usage
- Set appropriate limits

## Monitoring

### 1. n8n Execution Logs

- Vào **Executions** trong n8n
- Xem execution history
- Check error logs

### 2. Next.js API Logs

- Check server logs
- Monitor API endpoints
- Track sync events trong database

### 3. Database Monitoring

Query để xem imported posts:
```sql
SELECT p.*, s.structured_data->>'facebookPostId' as facebook_id
FROM "Post" p
LEFT JOIN "SEO" s ON s."postId" = p.id
WHERE s.structured_data->>'facebookPostId' IS NOT NULL
ORDER BY p."createdAt" DESC;
```

## Best Practices

1. **Start with DRAFT status**: Import posts as DRAFT, review manually trước khi publish
2. **Monitor duplicate checks**: Đảm bảo không import duplicate posts
3. **Image optimization**: Cloudinary sẽ tự động optimize images
4. **Tag management**: Review tags được tạo tự động, merge duplicates nếu cần
5. **Error handling**: Setup alerts cho failed imports
6. **Backup**: Backup database định kỳ
7. **Testing**: Test workflow trên staging environment trước khi deploy production

## Support

Nếu gặp vấn đề:

1. Check logs trong n8n và Next.js
2. Verify credentials và environment variables
3. Test API endpoints manually
4. Check Facebook API status
5. Review workflow execution history

## Changelog

### Version 1.0.0 (2025-01-27)
- Initial release
- Basic Facebook import functionality
- Image upload to Cloudinary
- Text to Markdown conversion
- Hashtag extraction and tag creation
- Duplicate checking
- Error handling and logging

## License

This workflow is part of the Next.js project and follows the same license.
