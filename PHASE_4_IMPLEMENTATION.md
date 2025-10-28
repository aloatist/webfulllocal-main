# 🚀 Phase 4: N8N Automation Integration - Implementation Guide

**Started**: January 22, 2025  
**Status**: ✅ **COMPLETE**  
**Completion**: 100%

---

## 📋 Overview

Phase 4 tập trung vào tự động hóa các quy trình vận hành thông qua n8n workflows, bao gồm:
- Thông báo booking tự động
- Nhắc nhở review sau chuyến đi
- Đăng bài tự động lên social media
- Báo cáo thống kê định kỳ

---

## ✅ Completed Features

### 1. Booking Notification System ✅

#### A. Tour Booking Notifications
**File**: `n8n/workflows/tour-booking-notification.json`

**Features:**
- ✅ Webhook trigger nhận booking data
- ✅ Email xác nhận cho khách hàng
- ✅ Email thông báo cho admin
- ✅ Telegram alert cho admin
- ✅ Response webhook với status

**Workflow Flow:**
```
Webhook → [Email Customer, Email Admin, Telegram] → Response
```

**Webhook URL**: `http://n8n:5678/webhook/tour-booking`

#### B. Homestay Booking Notifications
**File**: `n8n/workflows/homestay-booking-notification.json`

**Features:**
- ✅ Webhook trigger cho homestay bookings
- ✅ Email xác nhận với thông tin chi tiết
- ✅ Email thông báo admin với yêu cầu xử lý
- ✅ Telegram alert với đầy đủ thông tin
- ✅ Beautiful HTML email templates

**Webhook URL**: `http://n8n:5678/webhook/homestay-booking`

**Email Template Highlights:**
- Modern, responsive design
- Booking details với clear formatting
- Check-in/check-out times
- Contact information
- Call-to-action buttons

---

### 2. Review Reminder System ✅

**File**: `n8n/workflows/review-reminder.json`

**Features:**
- ✅ Daily cron job (9 AM)
- ✅ PostgreSQL query để tìm bookings cần review
- ✅ Chỉ gửi cho bookings đã hoàn thành trong 7 ngày
- ✅ Kiểm tra chưa có review
- ✅ Email nhắc nhở với link review
- ✅ Telegram summary report

**Logic:**
```sql
SELECT bookings 
WHERE status = 'COMPLETED'
  AND checkOutDate >= NOW() - 7 days
  AND checkOutDate < NOW()
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE bookingId = booking.id)
```

**Workflow Flow:**
```
Daily Cron → Query DB → Check if has bookings → [Send Emails, Send Summary]
```

---

### 3. Social Media Auto-Post ✅

**File**: `n8n/workflows/social-media-auto-post.json`

**Features:**
- ✅ Webhook trigger khi có content mới
- ✅ Conditional routing theo content type
- ✅ Facebook post automation
- ✅ Twitter/X post automation
- ✅ Custom message templates cho từng loại content
- ✅ Telegram confirmation

**Supported Content Types:**
1. **Tour**: Thông tin tour, giá, thời gian
2. **Homestay**: Thông tin phòng, giá, tiện nghi
3. **Blog Post**: Tiêu đề, excerpt, link

**Workflow Flow:**
```
Webhook → [Is Tour?, Is Homestay?, Is Blog?] → [Facebook, Twitter] → Telegram → Response
```

---

### 4. Enhanced Notification Library ✅

**File**: `conphung/lib/bookings/notifications.ts`

**New Function**: `notifyBookingCreated()`

**Features:**
- ✅ Support cả tour và homestay bookings
- ✅ Automatic webhook URL selection
- ✅ Authorization header với secret
- ✅ Error handling và logging
- ✅ Booking URL generation
- ✅ Full booking data serialization

**Usage:**
```typescript
import { notifyBookingCreated } from '@/lib/bookings/notifications'

// For tour booking
await notifyBookingCreated(booking, 'tour')

// For homestay booking
await notifyBookingCreated(booking, 'homestay')
```

---

## 📁 Files Created/Modified

### New Files (4)
| File | Lines | Purpose |
|------|-------|---------|
| `n8n/workflows/homestay-booking-notification.json` | 200+ | Homestay booking notifications |
| `n8n/workflows/review-reminder.json` | 150+ | Daily review reminders |
| `n8n/workflows/social-media-auto-post.json` | 250+ | Social media automation |
| `PHASE_4_IMPLEMENTATION.md` | This file | Documentation |

### Modified Files (1)
| File | Changes | Purpose |
|------|---------|---------|
| `conphung/lib/bookings/notifications.ts` | +60 lines | Enhanced notification system |

---

## 🔧 Environment Variables Required

Add these to your `.env` file:

```env
# N8N Webhook URLs
N8N_TOUR_BOOKING_WEBHOOK_URL=http://localhost:5678/webhook/tour-booking
N8N_HOMESTAY_BOOKING_WEBHOOK_URL=http://localhost:5678/webhook/homestay-booking
N8N_SOCIAL_POST_WEBHOOK_URL=http://localhost:5678/webhook/social-post

# N8N Authentication (Optional but recommended)
N8N_WEBHOOK_SECRET=your-secret-key-here

# Site URL for generating links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Setup Instructions

### Step 1: Import Workflows to n8n

1. Open n8n dashboard: `http://localhost:5678`
2. Go to **Workflows** → **Import from File**
3. Import each workflow:
   - `tour-booking-notification.json`
   - `homestay-booking-notification.json`
   - `review-reminder.json`
   - `social-media-auto-post.json`

### Step 2: Configure Credentials

#### A. SMTP Email (Required)
1. Go to **Credentials** → **Add Credential**
2. Select **SMTP**
3. Configure:
   ```
   Host: smtp.gmail.com (or your provider)
   Port: 587
   User: your-email@gmail.com
   Password: your-app-password
   ```

#### B. Telegram Bot (Optional)
1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Get your chat ID via [@userinfobot](https://t.me/userinfobot)
4. Add credential in n8n:
   ```
   Access Token: your-bot-token
   ```
5. Update `chatId` in workflows

#### C. Facebook (Optional)
1. Create Facebook App
2. Get Page Access Token
3. Add credential in n8n

#### D. Twitter/X (Optional)
1. Create Twitter Developer App
2. Get API keys
3. Add credential in n8n

#### E. PostgreSQL (For Review Reminder)
1. Add PostgreSQL credential:
   ```
   Host: localhost
   Port: 5432
   Database: your-database
   User: your-user
   Password: your-password
   ```

### Step 3: Activate Workflows

1. Open each workflow
2. Click **Active** toggle in top-right
3. Test webhooks using the test URLs

### Step 4: Test Integration

#### Test Tour Booking:
```bash
curl -X POST http://localhost:5678/webhook/tour-booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret" \
  -d '{
    "reference": "TOUR-001",
    "tourTitle": "Khám Phá Cồn Phụng",
    "customerName": "Nguyễn Văn A",
    "customerEmail": "test@example.com",
    "customerPhone": "0123456789",
    "departureDate": "2025-02-01",
    "adults": 2,
    "children": 1,
    "totalAmount": "2500000",
    "bookingUrl": "http://localhost:3000/admin/bookings/123"
  }'
```

#### Test Homestay Booking:
```bash
curl -X POST http://localhost:5678/webhook/homestay-booking \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "HS-001",
    "homestay": {
      "title": "Nhà Gỗ Bên Sông"
    },
    "customer": {
      "fullName": "Trần Thị B",
      "email": "test@example.com",
      "phone": "0987654321"
    },
    "checkInDate": "2025-02-15",
    "checkOutDate": "2025-02-17",
    "nights": 2,
    "guests": 4,
    "totalAmount": "1800000",
    "bookingUrl": "http://localhost:3000/admin/bookings/456"
  }'
```

---

## 🔗 Integration Points

### In Booking API Routes

Update your booking creation endpoints to trigger notifications:

```typescript
// app/api/bookings/route.ts
import { notifyBookingCreated } from '@/lib/bookings/notifications'

export async function POST(request: Request) {
  // ... create booking logic ...
  
  // Send notification
  await notifyBookingCreated(serializedBooking, 'tour')
  
  return NextResponse.json({ success: true, booking })
}
```

### In Homestay Booking Route

Already integrated in:
- `app/api/public/homestays/[slug]/book/route.ts` (line 206)

### For Social Media Posts

Add webhook call when publishing content:

```typescript
// When publishing tour/homestay/post
const response = await fetch(process.env.N8N_SOCIAL_POST_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentType: 'tour', // or 'homestay', 'post'
    title: 'Tour Title',
    summary: 'Tour description...',
    price: '2500000',
    duration: '3 ngày 2 đêm',
    url: 'https://conphungtourist.com//tours/tour-slug'
  })
})
```

---

## 📊 Monitoring & Logs

### View Workflow Executions
1. Go to n8n dashboard
2. Click **Executions** tab
3. View success/failure status
4. Check execution logs

### Telegram Notifications
All workflows send summaries to Telegram:
- Booking confirmations
- Review reminder reports
- Social media post confirmations

### Application Logs
Check console logs for:
```
[booking] notification sent via n8n
[booking] n8n webhook failed
```

---

## 🎯 Benefits

### 1. **Automated Customer Communication**
- Instant booking confirmations
- Professional email templates
- Reduced manual work

### 2. **Improved Review Collection**
- Automatic reminders after checkout
- Increased review rate
- Better social proof

### 3. **Enhanced Marketing**
- Auto-post to social media
- Consistent brand presence
- Wider reach

### 4. **Better Admin Experience**
- Real-time Telegram alerts
- Quick access to booking details
- Reduced response time

---

## 🔮 Future Enhancements

### Phase 4.2 (Optional)
- [ ] SMS notifications via Twilio
- [ ] WhatsApp Business integration
- [ ] Instagram auto-posting
- [ ] Weekly analytics reports
- [ ] Abandoned booking reminders
- [ ] Birthday/anniversary greetings
- [ ] Loyalty program automation

---

## 🐛 Troubleshooting

### Webhook Not Receiving Data
1. Check n8n is running: `docker ps | grep n8n`
2. Verify webhook URL is correct
3. Check n8n logs: `docker logs n8n`
4. Test with curl command

### Email Not Sending
1. Verify SMTP credentials
2. Check spam folder
3. Enable "Less secure app access" for Gmail
4. Use App Password instead of regular password

### Telegram Not Working
1. Verify bot token
2. Check chat ID is correct
3. Ensure bot is added to channel/group
4. Test bot with `/start` command

### Database Query Fails
1. Check PostgreSQL credentials
2. Verify table names match schema
3. Test query in Prisma Studio
4. Check database connection

---

## 📚 Resources

### Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Email Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### Workflow Templates
- Tour Booking: `n8n/workflows/tour-booking-notification.json`
- Homestay Booking: `n8n/workflows/homestay-booking-notification.json`
- Review Reminder: `n8n/workflows/review-reminder.json`
- Social Media: `n8n/workflows/social-media-auto-post.json`

---

## ✅ Testing Checklist

- [ ] Import all workflows to n8n
- [ ] Configure SMTP credentials
- [ ] Configure Telegram bot (optional)
- [ ] Test tour booking webhook
- [ ] Test homestay booking webhook
- [ ] Verify email delivery
- [ ] Check Telegram notifications
- [ ] Test review reminder (manual trigger)
- [ ] Test social media post (optional)
- [ ] Monitor execution logs
- [ ] Update environment variables
- [ ] Document any issues

---

## 🎉 Summary

Phase 4 đã hoàn thành với:
- ✅ 4 n8n workflows mới
- ✅ Enhanced notification system
- ✅ Beautiful email templates
- ✅ Multi-channel notifications (Email + Telegram)
- ✅ Automated review collection
- ✅ Social media automation
- ✅ Comprehensive documentation

**Next Steps**: Test thoroughly và deploy to production!

---

**Last Updated**: January 22, 2025  
**Status**: ✅ Ready for Testing
