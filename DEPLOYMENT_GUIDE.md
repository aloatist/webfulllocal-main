# 🚀 Deployment Guide - Hướng Dẫn Deploy Production

**Mục tiêu**: Deploy dự án lên production một cách an toàn và hiệu quả

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passed
- [ ] No TypeScript errors
- [ ] No console.log in production code
- [ ] Code reviewed
- [ ] Documentation updated

### 2. Environment
- [ ] Production environment variables ready
- [ ] Database migrated
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] CDN setup (if needed)

### 3. Third-party Services
- [ ] VNPay production credentials
- [ ] Google Analytics configured
- [ ] Email service setup
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring setup

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Pros**:
- Easy setup
- Automatic deployments
- Built-in CDN
- Edge functions
- Free SSL
- Preview deployments

**Steps**:

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Link Project
```bash
cd /Users/congtrinh/webfulllocal-main/conphung
vercel link
```

#### 4. Set Environment Variables
```bash
# Via CLI
vercel env add DATABASE_URL
vercel env add VNPAY_TMN_CODE
vercel env add VNPAY_HASH_SECRET
# ... add all variables

# Or via Vercel Dashboard:
# https://vercel.com/[your-team]/[project]/settings/environment-variables
```

**Required Environment Variables**:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://conphungtourist.com
NEXTAUTH_SECRET=your-production-secret
VNPAY_TMN_CODE=your-production-code
VNPAY_HASH_SECRET=your-production-secret
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://conphungtourist.com/payment/vnpay/callback
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_BASE_URL=https://conphungtourist.com
```

#### 5. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

#### 6. Configure Domain
```bash
# Add custom domain
vercel domains add conphungtourist.com

# Verify DNS settings
# Add A record: 76.76.21.21
# Or CNAME: cname.vercel-dns.com
```

---

### Option 2: Docker + VPS

**Pros**:
- Full control
- Cost-effective for high traffic
- Can run additional services

**Steps**:

#### 1. Build Docker Images
```bash
cd /Users/congtrinh/webfulllocal-main

# Build frontend
docker build -t conphung-frontend ./conphung

# Build backend (if needed)
docker build -t conphung-backend ./backend
```

#### 2. Push to Registry
```bash
# Tag images
docker tag conphung-frontend your-registry/conphung-frontend:latest

# Push
docker push your-registry/conphung-frontend:latest
```

#### 3. Deploy to VPS
```bash
# SSH to server
ssh user@your-server.com

# Pull images
docker pull your-registry/conphung-frontend:latest

# Run with docker-compose
docker-compose up -d
```

**docker-compose.yml** (production):
```yaml
version: '3.8'

services:
  frontend:
    image: your-registry/conphung-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - VNPAY_TMN_CODE=${VNPAY_TMN_CODE}
      # ... other env vars
    restart: always
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: always

volumes:
  postgres_data:
```

---

### Option 3: AWS / GCP / Azure

**Steps vary by provider**. General approach:

1. Setup compute instance (EC2, Compute Engine, VM)
2. Install Node.js and dependencies
3. Clone repository
4. Build application
5. Setup process manager (PM2)
6. Configure reverse proxy (Nginx)
7. Setup SSL (Let's Encrypt)
8. Configure auto-scaling (optional)

---

## 🔧 Post-Deployment Configuration

### 1. Database Migration

```bash
# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

### 2. SSL Certificate

**With Vercel**: Automatic

**With Let's Encrypt**:
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d conphungtourist.com-d www.conphungtourist.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Nginx Configuration

**/etc/nginx/sites-available/conphungtourist.com**:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name conphungtourist.comwww.conphungtourist.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name conphungtourist.comwww.conphungtourist.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/conphungtourist.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conphungtourist.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images caching
    location ~* \.(jpg|jpeg|png|gif|ico|webp|avif)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### 4. PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "conphung" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs conphung
```

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [{
    name: 'conphung',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/conphung',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

---

## 🔍 Monitoring & Logging

### 1. Setup Sentry (Error Tracking)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

**sentry.client.config.js**:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 2. Setup Uptime Monitoring

**Options**:
- UptimeRobot (free)
- Pingdom
- StatusCake
- New Relic

**Configure**:
- Monitor: https://conphungtourist.com
- Check interval: 5 minutes
- Alert: Email + SMS

### 3. Log Management

**With PM2**:
```bash
# View logs
pm2 logs conphung

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**With ELK Stack** (advanced):
- Elasticsearch: Store logs
- Logstash: Process logs
- Kibana: Visualize logs

---

## 📊 Performance Optimization

### 1. CDN Configuration

**Cloudflare** (Recommended):
1. Add site to Cloudflare
2. Update nameservers
3. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - HTTP/3
   - Image optimization
4. Configure caching rules

### 2. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_tours_status ON "Tour"(status);
CREATE INDEX idx_bookings_customer ON "Booking"("customerId");
CREATE INDEX idx_payments_booking ON "Payment"("bookingId");

-- Analyze queries
EXPLAIN ANALYZE SELECT * FROM "Tour" WHERE status = 'PUBLISHED';
```

### 3. Redis Caching

```typescript
// lib/cache/redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Fetch and cache
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

---

## 🧪 Post-Deployment Testing

### Smoke Test Checklist

```bash
# 1. Homepage loads
curl -I https://conphungtourist.com
# Expected: 200 OK

# 2. API responds
curl https://conphungtourist.com/api/health
# Expected: {"status":"ok"}

# 3. Payment flow works
# Manual test: Complete a booking

# 4. Analytics tracking
# Check Google Analytics Real-Time

# 5. Error tracking
# Trigger test error, check Sentry

# 6. Performance
# Run Lighthouse audit
# Expected: 90+ score
```

---

## 🚨 Rollback Procedure

### If Issues Detected:

#### With Vercel:
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

#### With Docker:
```bash
# Stop current
docker-compose down

# Pull previous version
docker pull your-registry/conphung-frontend:previous

# Start
docker-compose up -d
```

#### With PM2:
```bash
# Stop app
pm2 stop conphung

# Checkout previous version
git checkout [previous-commit]

# Rebuild
npm run build

# Restart
pm2 restart conphung
```

---

## 📞 Emergency Contacts

**Technical Lead**: +84 918 267 715  
**DevOps**: devops@conphungtourist.com 
**VNPay Support**: 1900 55 55 77  
**Hosting Support**: [Your provider]

---

## ✅ Post-Deployment Checklist

### Day 1
- [ ] All services running
- [ ] No critical errors
- [ ] Payment flow tested
- [ ] Analytics tracking
- [ ] SSL certificate valid
- [ ] Monitoring active

### Week 1
- [ ] Performance metrics reviewed
- [ ] User feedback collected
- [ ] Error logs reviewed
- [ ] Database performance checked
- [ ] Backup verified
- [ ] Security scan completed

### Month 1
- [ ] Traffic analysis
- [ ] Conversion rate review
- [ ] Cost optimization
- [ ] Feature requests prioritized
- [ ] Technical debt addressed

---

**Last Updated**: 27/10/2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
