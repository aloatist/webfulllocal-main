# 🎯 Admin Panel - Hướng Dẫn Sử Dụng Đầy Đủ

## 📋 Mục Lục
1. [Đăng Nhập](#đăng-nhập)
2. [Dashboard](#dashboard)
3. [Quản Lý Nội Dung](#quản-lý-nội-dung)
4. [Quản Lý Tours](#quản-lý-tours)
5. [Quản Lý Homestays](#quản-lý-homestays)
6. [Marketing & Promotions](#marketing--promotions)
7. [Analytics](#analytics)
8. [Integrations](#integrations)
9. [Settings](#settings)

---

## 🔐 Đăng Nhập

### Thông Tin Đăng Nhập Mặc Định

```
🌐 URL: http://localhost:3000/login
📧 Email: aloatist@gmail.com
🔑 Password: ChangeMe123!
```

### Đổi Mật Khẩu

⚠️ **QUAN TRỌNG**: Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

1. Nhấp vào avatar ở góc phải trên
2. Chọn "Profile"
3. Chọn "Change Password"
4. Nhập mật khẩu mới và xác nhận

---

## 📊 Dashboard

Dashboard cung cấp cái nhìn tổng quan về:
- **Tổng quan doanh thu**: Revenue từ Tours & Homestays
- **Bookings**: Số lượng đặt chỗ theo thời gian
- **Khách hàng**: Thống kê khách hàng mới & quay lại
- **Đánh giá**: Rating trung bình và số lượng reviews

### Quick Actions
- **View Reports**: Xem báo cáo chi tiết
- **Pending Bookings**: Xử lý booking chờ xác nhận
- **New Reviews**: Kiểm duyệt đánh giá mới

---

## 📝 Quản Lý Nội Dung

### Posts (Bài Viết)

**Tạo Bài Viết Mới:**
1. Navigate: `Admin > Content > Posts`
2. Nhấp "New Post"
3. Điền thông tin:
   - Title (Tiêu đề)
   - Content (Nội dung - Markdown support)
   - Excerpt (Tóm tắt)
   - Featured Image (Ảnh đại diện)
   - Categories & Tags
4. Chọn status: Draft / Published
5. Click "Publish"

**SEO Optimization:**
- Meta Title: 60 ký tự
- Meta Description: 160 ký tự
- Focus Keyword
- URL Slug

### Categories (Danh Mục)

**Quản Lý Categories:**
- Tạo category mới
- Hierarchy (parent/child)
- Description
- SEO meta tags

### Tags

**Quản Lý Tags:**
- Tạo tag mới
- Gán tag cho posts
- Thống kê posts per tag

### Media Library

**Upload Media:**
1. Navigate: `Admin > Media`
2. Drag & drop hoặc click "Upload"
3. Supported formats: JPG, PNG, GIF, SVG, PDF
4. Max size: 10MB per file

**Media Management:**
- Edit alt text
- Crop/Resize
- Delete unused media
- Organize in folders

---

## 🗺️ Quản Lý Tours

### Tạo Tour Mới

**Bước 1: Thông Tin Cơ Bản**
- Tour Name (Tên tour)
- Slug (URL friendly)
- Summary (Mô tả ngắn)
- Hero Image
- Duration (Số ngày/đêm)
- Difficulty Level
- Base Price

**Bước 2: Chi Tiết Tour**
- Detailed Description
- Meeting Point
- Departure City
- Arrival City
- Highlights (Điểm nổi bật)
- Inclusions (Bao gồm)
- Exclusions (Không bao gồm)

**Bước 3: Itinerary (Lịch Trình)**
- Thêm từng ngày
- Activities per day
- Meals included
- Accommodation

**Bước 4: Media**
- Upload tour photos
- Video tours
- Virtual tour (360°)

**Bước 5: Pricing & Availability**
- Departures (Lịch khởi hành)
- Seats per departure
- Price per person
- Group discounts

### Tour Addons

**Tạo Add-on Services:**
- Name & Description
- Price
- Per Person / Per Group
- Availability

### Tour Bookings

**Quản Lý Booking:**
1. View all bookings
2. Filter by: Status / Date / Tour
3. Actions:
   - Confirm booking
   - Cancel booking
   - Send confirmation email
   - Generate invoice

**Booking Workflow:**
```
PENDING → CONFIRMED → COMPLETED
         ↓
      CANCELLED
```

---

## 🏠 Quản Lý Homestays

### Tạo Homestay Mới

**Thông Tin Homestay:**
- Title & Slug
- Summary & Description
- Location (Address, City, GPS)
- Amenities
- House Rules
- Check-in/Check-out times
- Base Price & Currency

**Homestay Types:**
- Entire Place (Toàn bộ nhà)
- Private Room (Phòng riêng)
- Shared Room (Phòng chung)

**Property Categories:**
- Apartment, House, Villa, Condo
- Studio, Loft, Bungalow
- Cabin, Treehouse, Boat
- Other

### Quản Lý Rooms

**Tạo Room:**
1. Navigate to Homestay detail
2. Click "Add Room"
3. Fill information:
   - Room Name
   - Slug
   - Description
   - Size (sqm)
   - Base Price
   - Max Guests
   - Bed Types
   - Amenities
   - Hero Image

### Availability Management

**Cập Nhật Khả Dụng:**
- Calendar view
- Set blocked dates
- Minimum stay requirements
- Maximum advance booking
- Last-minute bookings

**Bulk Update:**
- Select date range
- Set availability status:
  - OPEN
  - CLOSED
  - BLOCKED

### Pricing Rules

**Tạo Pricing Rule:**
- Rule Name
- Type:
  - Seasonal
  - Weekend
  - Holiday
  - Long Stay
  - Early Bird
  - Last Minute
- Date Range
- Adjustment Type: Percentage / Fixed Amount
- Priority (rule precedence)

**Example Rules:**
```
1. Weekend +20% (Friday-Sunday)
2. Tet Holiday +50% (Lunar New Year)
3. Long Stay -10% (7+ nights)
4. Early Bird -15% (30+ days advance)
```

### Homestay Bookings

**Process Booking:**
1. Review booking details
2. Check availability
3. Confirm/Reject
4. Send confirmation
5. Collect payment
6. Check-in/Check-out

---

## 🎁 Marketing & Promotions

### Tạo Promotion Code

**Discount Types:**
- **Percentage**: 10%, 20%, etc.
- **Fixed Amount**: 100,000 VND, 500,000 VND

**Promotion Settings:**
- Code (e.g., SUMMER2024)
- Description
- Discount Value
- Max Discount (for percentage)
- Minimum Order
- Usage Limit
- Valid Period (Start/End Date)
- Applicable To: Tours / Homestays / Both

**Example Promotions:**
```
Code: WELCOME10
Type: Percentage
Value: 10%
Min Order: 1,000,000 VND
Usage Limit: 100
Period: 2024-01-01 to 2024-12-31
```

### Email Marketing

**Create Campaign:**
1. Campaign Name
2. Subject Line
3. Email Content (HTML/WYSIWYG)
4. Target Audience:
   - All Customers
   - New Customers
   - Returning Customers
   - Specific Segments
5. Schedule: Immediate / Scheduled

---

## 📈 Analytics

### Dashboard Metrics

**Key Performance Indicators (KPIs):**
- **Revenue**: Total, Tours, Homestays
- **Bookings**: Count, Conversion Rate
- **Customers**: Total, New, Returning
- **Average Rating**: Overall satisfaction

**Charts & Graphs:**
- Revenue Trend (Monthly)
- Booking Distribution
- Customer Growth
- Popular Tours/Homestays

### Reports

**Available Reports:**
1. **Revenue Report**
   - Filter by: Date Range, Type
   - Export: PDF, Excel

2. **Booking Report**
   - Bookings by status
   - Cancellation rate
   - Lead time analysis

3. **Customer Report**
   - Demographics
   - Booking frequency
   - Lifetime value

4. **Performance Report**
   - Top selling tours
   - Occupancy rates
   - Average booking value

---

## 🔗 Integrations

### n8n Automation

**Setup n8n:**
1. Install n8n: `npm install -g n8n`
2. Start n8n: `n8n start`
3. Access: `http://localhost:5678`

**Common Workflows:**

**1. Booking Confirmation**
```
Trigger: New Booking
→ Send Email
→ Send SMS
→ Add to Calendar
→ Update Availability
```

**2. Review Request**
```
Trigger: Booking Completed (3 days)
→ Send Review Request Email
→ Wait 7 days
→ Send Reminder (if not reviewed)
```

**3. Price Sync**
```
Trigger: Daily 2AM
→ Fetch External Prices
→ Update Local Prices
→ Notify Admin if changes
```

### Integration Channels

**Booking.com:**
- Sync availability
- Sync prices
- Import bookings
- Push inventory

**Airbnb:**
- Calendar sync
- Pricing sync
- Messaging

**Payment Gateways:**
- VNPay
- MoMo
- ZaloPay
- Stripe
- PayPal

---

## ⚙️ Settings

### General Settings

**Site Information:**
- Site Name
- Site Description
- Contact Email
- Phone Number
- Address

**SEO Settings:**
- Default Meta Title
- Default Meta Description
- Social Media Links

### Email Settings

**SMTP Configuration:**
- SMTP Host
- SMTP Port
- Username
- Password
- From Name
- From Email

**Email Templates:**
- Booking Confirmation
- Booking Reminder
- Review Request
- Promotional Emails

### Payment Settings

**Configure Gateways:**
- VNPay: TMN Code, Hash Secret
- MoMo: Partner Code, Access Key
- Stripe: Publishable Key, Secret Key

### Notification Settings

**Notification Channels:**
- Email ✅
- SMS ✅
- Push Notifications
- In-App Notifications

**Admin Notifications:**
- New Booking
- New Review
- Payment Received
- System Alerts

---

## 🛡️ Best Practices

### Security

1. **Strong Passwords**
   - Min 12 characters
   - Mix of letters, numbers, symbols

2. **2FA Authentication**
   - Enable for all admin accounts

3. **Regular Backups**
   - Daily database backup
   - Weekly media backup

4. **Access Control**
   - Limit admin users
   - Use role-based permissions

### Performance

1. **Image Optimization**
   - Compress images before upload
   - Use WebP format
   - Lazy loading

2. **Caching**
   - Enable page caching
   - CDN for media

3. **Database**
   - Regular maintenance
   - Index optimization

### SEO

1. **Content Quality**
   - Original content
   - Regular updates
   - Keyword research

2. **Technical SEO**
   - Fast loading speed
   - Mobile responsive
   - HTTPS enabled

3. **Local SEO**
   - Google My Business
   - Local citations
   - Reviews

---

## 🆘 Support

### Getting Help

**Documentation:**
- User Guide (this file)
- API Documentation
- Video Tutorials

**Contact:**
- Email: support@example.com
- Phone: +84 123 456 789
- Live Chat: Available 9AM-6PM

**Community:**
- Forum: community.example.com
- Facebook Group
- Telegram Channel

---

## 📚 Additional Resources

### Video Tutorials
1. Getting Started with Admin Panel
2. Creating Your First Tour
3. Managing Homestay Bookings
4. Setting Up Promotions
5. n8n Automation Workflows

### Cheat Sheets
- Markdown Syntax
- SEO Checklist
- Booking Workflow
- Troubleshooting Guide

### API Documentation
- REST API Reference
- Webhook Events
- Authentication
- Rate Limits

---

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Author:** Admin Team
