# Environment Variables Template

Copy this to `.env.local` and fill in your values.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/conphung"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# VNPay Configuration (Sandbox for testing)
VNPAY_TMN_CODE="DEMOV210"
VNPAY_HASH_SECRET="RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ"
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:3000/payment/vnpay/callback"
VNPAY_API_URL="https://sandbox.vnpayment.vn/merchant_webapi/api/transaction"

# VNPay Production (uncomment when ready)
# VNPAY_TMN_CODE="your_production_code"
# VNPAY_HASH_SECRET="your_production_secret"
# VNPAY_URL="https://vnpayment.vn/paymentv2/vpcpay.html"
# VNPAY_RETURN_URL="https://conphungtourist.com/payment/vnpay/callback"
# VNPAY_API_URL="https://vnpayment.vn/merchant_webapi/api/transaction"

# MoMo Configuration (optional)
MOMO_PARTNER_CODE=""
MOMO_ACCESS_KEY=""
MOMO_SECRET_KEY=""
MOMO_ENDPOINT="https://test-payment.momo.vn"

# Stripe Configuration (optional)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email Service (optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@conphungtourist.com"

# Sentry (optional - for error tracking)
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""

# Redis (optional - for caching and rate limiting)
REDIS_URL="redis://localhost:6379"

# Feature Flags
ENABLE_PAYMENT="true"
ENABLE_ANALYTICS="true"
ENABLE_I18N="false"
```

## Production Checklist

Before deploying to production:

- [ ] Update all URLs to production domain
- [ ] Use production VNPay credentials
- [ ] Setup production database
- [ ] Configure SSL certificate
- [ ] Enable error tracking (Sentry)
- [ ] Setup email service
- [ ] Configure CDN for images
- [ ] Enable Redis for caching
- [ ] Test all payment flows
- [ ] Verify analytics tracking

## Security Notes

1. **Never commit `.env.local` to git**
2. **Use strong secrets** for NEXTAUTH_SECRET
3. **Rotate credentials** regularly
4. **Use environment-specific** values
5. **Enable 2FA** for payment gateways
6. **Monitor logs** for suspicious activity
7. **Backup database** regularly
8. **Use HTTPS** in production
