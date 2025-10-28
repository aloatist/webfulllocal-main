# 🧪 Testing Guide - Hướng Dẫn Test Toàn Diện

**Mục tiêu**: Đảm bảo tất cả tính năng hoạt động chính xác trước khi deploy production

---

## 📋 Pre-Testing Checklist

### 1. Environment Setup
```bash
# Verify environment variables
cat conphung/.env.local

# Should have:
# - DATABASE_URL
# - VNPAY_* variables
# - NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### 2. Database Setup
```bash
# Check database connection
cd conphung
npx prisma studio

# Verify tables exist:
# - Tour, Homestay, Booking, Payment, Customer
```

### 3. Start Development Server
```bash
npm run dev

# Should start on http://localhost:3000
# Check for any startup errors
```

---

## 🎯 Test Cases

### A. Payment Flow Testing (Critical)

#### Test 1: VNPay QR Code Payment
**Steps**:
1. Navigate to http://localhost:3000/tours
2. Select any tour
3. Click "Đặt ngay"
4. Fill booking form:
   - Adults: 2
   - Children: 1
   - Customer info: Valid email & phone
5. Click "Xác nhận đặt tour"
6. On payment page, select "Quét mã QR"
7. Click "Thanh toán ngay"

**Expected**:
- ✅ Redirected to VNPay sandbox
- ✅ QR code displayed
- ✅ Can scan and pay

**Test Card**:
- Bank: NCB
- Card: 9704198526191432198
- Name: NGUYEN VAN A
- Issue: 07/15
- OTP: 123456

#### Test 2: ATM Card Payment
**Steps**:
1-5. Same as Test 1
6. Select "Thẻ ATM nội địa"
7. Choose bank: Vietcombank
8. Click "Thanh toán ngay"
9. Enter test card info
10. Enter OTP: 123456

**Expected**:
- ✅ Redirected to VNPay
- ✅ Bank selection works
- ✅ Payment processed
- ✅ Redirected to success page
- ✅ Email sent (check logs)

#### Test 3: Payment Callback
**Steps**:
1. Complete payment flow
2. Check callback URL is called
3. Verify database updates

**Verify**:
```bash
# Open Prisma Studio
npx prisma studio

# Check Payment table:
# - Status should be "SUCCEEDED"
# - externalId should have VNPay transaction ID
# - paidAt should have timestamp

# Check Booking table:
# - Status should be "CONFIRMED"
```

#### Test 4: Failed Payment
**Steps**:
1-8. Same as Test 2
9. Click "Cancel" on VNPay page

**Expected**:
- ✅ Redirected to error page
- ✅ Payment status = "FAILED"
- ✅ Booking status = "PENDING"
- ✅ Error message displayed

---

### B. Rate Limiting Testing

#### Test 5: API Rate Limiting
**Test Script**:
```bash
# Test rate limiting (should fail after 10 requests)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/payment/vnpay \
    -H "Content-Type: application/json" \
    -d '{"bookingId":"test","amount":1000000,"orderInfo":"test"}' \
    -w "\nRequest $i - Status: %{http_code}\n"
  sleep 0.5
done
```

**Expected**:
- ✅ First 10 requests: 200 or 400 (valid response)
- ✅ Requests 11-15: 429 (Too Many Requests)
- ✅ Response includes rate limit headers

---

### C. Performance Testing

#### Test 6: Image Loading
**Steps**:
1. Open homepage
2. Open DevTools > Network > Img
3. Scroll through page

**Verify**:
- ✅ Images load progressively
- ✅ Blur placeholder shows first
- ✅ WebP/AVIF format used
- ✅ Lazy loading works (images below fold load on scroll)
- ✅ No layout shift (CLS < 0.1)

#### Test 7: Bundle Size
**Steps**:
```bash
# Build production
npm run build

# Check bundle sizes
ls -lh .next/static/chunks/

# Analyze bundle
npx @next/bundle-analyzer
```

**Expected**:
- ✅ vendor.js < 200KB
- ✅ react.js < 150KB
- ✅ ui.js < 100KB
- ✅ Total initial load < 300KB

#### Test 8: Lighthouse Score
**Steps**:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit (Desktop & Mobile)

**Expected**:
- ✅ Performance: 90+
- ✅ Accessibility: 95+
- ✅ Best Practices: 95+
- ✅ SEO: 100
- ✅ PWA: 90+ (if enabled)

---

### D. SEO Testing

#### Test 9: Structured Data
**Steps**:
1. Visit tour page
2. View page source
3. Search for `<script type="application/ld+json">`

**Verify**:
- ✅ TouristTrip schema present
- ✅ Valid JSON-LD format
- ✅ All required fields filled

**Test with Google**:
https://search.google.com/test/rich-results

#### Test 10: Sitemap
**Steps**:
1. Visit http://localhost:3000/sitemap.xml
2. Verify XML format
3. Check all URLs present

**Expected**:
- ✅ Valid XML
- ✅ All tours listed
- ✅ All homestays listed
- ✅ Static pages listed
- ✅ lastmod dates present

#### Test 11: Robots.txt
**Steps**:
1. Visit http://localhost:3000/robots.txt

**Expected**:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: http://localhost:3000/sitemap.xml
```

---

### E. Analytics Testing

#### Test 12: Google Analytics
**Steps**:
1. Open browser console
2. Navigate to different pages
3. Check for gtag events

**Verify**:
```javascript
// Should see in console:
gtag('config', 'G-XXXXXXXXXX', { page_path: '/tours' })
gtag('event', 'page_view', ...)
```

#### Test 13: Event Tracking
**Steps**:
1. Complete a booking
2. Check console for events

**Expected**:
```javascript
gtag('event', 'booking_completed', ...)
gtag('event', 'purchase', { transaction_id: '...', value: 1000000 })
```

---

### F. Security Testing

#### Test 14: Security Headers
**Steps**:
```bash
curl -I http://localhost:3000
```

**Verify Headers**:
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security (in production)

#### Test 15: SQL Injection Prevention
**Steps**:
1. Try SQL injection in search:
   ```
   ' OR 1=1 --
   '; DROP TABLE tours; --
   ```

**Expected**:
- ✅ No error
- ✅ No data leaked
- ✅ Prisma sanitizes input

---

### G. Mobile Testing

#### Test 16: Responsive Design
**Test Devices**:
- iPhone 12 (390x844)
- iPad (768x1024)
- Samsung Galaxy S21 (360x800)

**Verify**:
- ✅ Layout adapts correctly
- ✅ Touch targets > 44px
- ✅ Text readable without zoom
- ✅ No horizontal scroll
- ✅ Images scale properly

#### Test 17: Touch Interactions
**Steps**:
1. Test on mobile device
2. Try all interactive elements

**Verify**:
- ✅ Buttons respond to touch
- ✅ Forms work on mobile
- ✅ Swipe gestures work (if any)
- ✅ No accidental clicks

---

## 📊 Test Results Template

### Test Session: [Date]
**Tester**: [Name]  
**Environment**: Development / Staging / Production  
**Browser**: Chrome / Safari / Firefox  
**Device**: Desktop / Mobile

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | VNPay QR Payment | ✅ Pass | - |
| 2 | ATM Card Payment | ✅ Pass | - |
| 3 | Payment Callback | ✅ Pass | - |
| 4 | Failed Payment | ✅ Pass | - |
| 5 | Rate Limiting | ✅ Pass | - |
| 6 | Image Loading | ✅ Pass | - |
| 7 | Bundle Size | ✅ Pass | 280KB total |
| 8 | Lighthouse | ✅ Pass | 92/100 |
| 9 | Structured Data | ✅ Pass | - |
| 10 | Sitemap | ✅ Pass | - |
| 11 | Robots.txt | ✅ Pass | - |
| 12 | Google Analytics | ✅ Pass | - |
| 13 | Event Tracking | ✅ Pass | - |
| 14 | Security Headers | ✅ Pass | - |
| 15 | SQL Injection | ✅ Pass | - |
| 16 | Responsive Design | ✅ Pass | - |
| 17 | Touch Interactions | ✅ Pass | - |

**Overall Status**: ✅ All tests passed

---

## 🐛 Bug Report Template

### Bug #[Number]
**Title**: [Short description]  
**Severity**: Critical / High / Medium / Low  
**Status**: Open / In Progress / Fixed  

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[Attach if relevant]

**Environment**:
- Browser: Chrome 120
- OS: macOS 14
- Device: MacBook Pro

**Logs**:
```
[Error logs here]
```

---

## ✅ Production Readiness Checklist

### Before Deploy
- [ ] All tests passed
- [ ] No critical bugs
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Database backed up
- [ ] Environment variables set
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Email service tested
- [ ] Payment gateway tested
- [ ] Analytics verified
- [ ] Error tracking setup
- [ ] Monitoring configured

### After Deploy
- [ ] Smoke test all features
- [ ] Verify payment flow
- [ ] Check analytics data
- [ ] Monitor error logs
- [ ] Test from different locations
- [ ] Verify email delivery
- [ ] Check performance metrics
- [ ] Test mobile experience

---

## 🚨 Emergency Rollback Plan

If critical issues found in production:

```bash
# 1. Rollback to previous version
vercel rollback

# 2. Or redeploy last stable version
git checkout [last-stable-commit]
vercel --prod

# 3. Notify users (if needed)
# 4. Fix issues in development
# 5. Test thoroughly
# 6. Redeploy
```

---

## 📞 Support Contacts

**Technical Issues**: dev@conphungtourist.com 
**Payment Issues**: payment@conphungtourist.com 
**Emergency**: +84 918 267 715

---

**Last Updated**: 27/10/2025  
**Version**: 1.0.0
