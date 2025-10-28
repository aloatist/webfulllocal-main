# Phase 6: Advanced Features - Implementation Guide

**Status**: 📋 **PLANNING & REFERENCE**  
**Purpose**: Guide for future implementation

---

## 📊 Phase 6 Overview

| Phase | Feature | Status | Priority | Time |
|-------|---------|--------|----------|------|
| 6.1 | Multi-language (i18n) | 📋 Planned | Medium | 5-7 days |
| 6.2 | Payment Gateway | 📋 Planned | High | 5-7 days |
| 6.3 | Live Chat Support | ✅ Complete | High | 1-2 days |
| 6.4 | Loyalty Program | 📋 Planned | Low | 7-10 days |

---

## 🌍 Phase 6.1: Multi-language (i18n)

### Technology Stack
- **next-intl** - Next.js internationalization
- **Languages**: Vietnamese (default), English, Chinese (optional)

### Quick Setup
```bash
npm install next-intl
```

### Key Files
- `messages/vi.json` - Vietnamese translations
- `messages/en.json` - English translations
- `messages/zh.json` - Chinese translations
- `i18n.ts` - Configuration
- `middleware.ts` - Locale detection

### Implementation Checklist
- [ ] Install next-intl
- [ ] Create message files
- [ ] Setup middleware
- [ ] Add language switcher
- [ ] Translate all pages
- [ ] Update SEO metadata
- [ ] Test all languages

### Resources
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## 💳 Phase 6.2: Payment Gateway Integration

### Payment Providers

#### VNPay (Vietnam)
- ATM cards, Credit cards, QR code
- Most popular in Vietnam

#### MoMo (Vietnam)
- E-wallet, QR code, App-to-app
- Very popular mobile payment

#### ZaloPay (Vietnam)
- E-wallet integrated with Zalo
- Growing market share

#### Stripe (International)
- Credit cards, International payments
- For foreign tourists

### Environment Variables Needed
```bash
# VNPay
VNPAY_TMN_CODE=xxx
VNPAY_HASH_SECRET=xxx
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# MoMo
MOMO_PARTNER_CODE=xxx
MOMO_ACCESS_KEY=xxx
MOMO_SECRET_KEY=xxx
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Implementation Checklist
- [ ] Register for sandbox accounts
- [ ] Implement VNPay integration
- [ ] Implement MoMo integration
- [ ] Create payment UI
- [ ] Setup webhooks
- [ ] Test sandbox payments
- [ ] Handle payment failures
- [ ] Send confirmation emails
- [ ] Test production

### Resources
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)
- [MoMo Documentation](https://developers.momo.vn/)
- [Stripe Documentation](https://stripe.com/docs)

---

## 🎁 Phase 6.4: Loyalty Program

### Features

#### 1. Points System
- Earn points on bookings (1 point = 1,000 VND)
- Redeem points for discounts

#### 2. Member Tiers
- **Bronze**: 0-999 points
- **Silver**: 1,000-4,999 points
- **Gold**: 5,000-9,999 points
- **Platinum**: 10,000+ points

#### 3. Referral Program
- Refer friends, both get rewards
- Track referrals

#### 4. Discount Codes
- Promo codes
- Seasonal discounts
- Member-exclusive codes

### Database Schema Additions
```prisma
model LoyaltyAccount {
  id             String   @id @default(cuid())
  customerId     String   @unique
  points         Int      @default(0)
  tier           LoyaltyTier @default(BRONZE)
  lifetimePoints Int      @default(0)
  referralCode   String   @unique
  createdAt      DateTime @default(now())
}

enum LoyaltyTier {
  BRONZE
  SILVER
  GOLD
  PLATINUM
}

model PointTransaction {
  id          String   @id @default(cuid())
  accountId   String
  type        TransactionType
  points      Int
  description String
  createdAt   DateTime @default(now())
}

model DiscountCode {
  id           String   @id @default(cuid())
  code         String   @unique
  type         DiscountType
  value        Float
  validFrom    DateTime
  validTo      DateTime
  usageLimit   Int?
  active       Boolean  @default(true)
}
```

### Implementation Checklist
- [ ] Design loyalty schema
- [ ] Implement points system
- [ ] Create member tiers
- [ ] Build referral system
- [ ] Implement discount codes
- [ ] Create loyalty dashboard
- [ ] Add points history
- [ ] Email notifications
- [ ] Admin management

---

## 🎯 Implementation Priority

### High Priority (Do First)
1. **Payment Gateway** (6.2) - Critical for revenue

### Medium Priority
2. **Multi-language** (6.1) - Expand market

### Low Priority
3. **Loyalty Program** (6.4) - Retention strategy

---

## 📝 Notes

These features are documented for future implementation. 
Each phase includes:
- Technology recommendations
- Code examples
- Setup instructions
- Checklists
- Resources

Start with Payment Gateway as it's most critical for business.

---

**Last Updated**: January 22, 2025  
**Status**: Planning Document
