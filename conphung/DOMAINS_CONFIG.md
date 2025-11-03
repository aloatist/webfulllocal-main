# 🌐 DOMAINS CONFIGURATION

## 2 Trang Web Chính

### 1. 🏝️ ConPhung Tourist (Main Website)
- **Domain**: https://conphungtourist.com
- **Purpose**: Trang chính về Khu Du Lịch Cồn Phụng
- **Features**:
  - Tours booking
  - Homestays
  - Blog/Posts
  - Restaurant info
  - Gallery
  - Contact & Reviews

### 2. 🏡 Coco Island (Homestay Brand)
- **Domain**: https://cocoisland.vn
- **Purpose**: Trang riêng cho Homestay Coco Island
- **Features**:
  - Room booking
  - Availability calendar
  - Reviews
  - Amenities showcase
  - Direct booking system

---

## ✅ CẤU HÌNH HIỆN TẠI

### 1. Site Config (`site.config.ts`)
```typescript
site_domain: "https://conphungtourist.com"
```

### 2. Next.js Config (`next.config.mjs`)
```javascript
images: {
  remotePatterns: [
    { hostname: "conphungtourist.com" },
    { hostname: "cocoisland.vn" }
  ]
}
```

### 3. Schema Markup
- **OrganizationSchema**: ✅ Uses conphungtourist.com
- **Breadcrumbs**: ✅ All pages reference conphungtourist.com
- **Sitemap**: ✅ Generated with conphungtourist.com base

### 4. Cross-References
- ConPhung Tourist → Coco Island: ✅ Link exists in layout
- Coco Island → ConPhung Tourist: ✅ Parent site reference

---

## 🔧 PRODUCTION SETUP REQUIRED

### For conphungtourist.com:

```nginx
# Nginx config
server {
    listen 443 ssl http2;
    server_name conphungtourist.com www.conphungtourist.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/conphungtourist.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conphungtourist.com/privkey.pem;
    
    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### For cocoisland.vn:

**Option 1: Same App (Recommended)**
```nginx
# Route cocoisland.vn to /cocoisland path
server {
    listen 443 ssl http2;
    server_name cocoisland.vn www.cocoisland.vn;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/cocoisland.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cocoisland.vn/privkey.pem;
    
    # Proxy to same Next.js app
    location / {
        proxy_pass http://localhost:3000/cocoisland;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Option 2: Separate App**
- Deploy another instance on different port
- Point cocoisland.vn to that instance

---

## 📋 DNS CONFIGURATION

### conphungtourist.com
```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
CNAME   www     conphungtourist.com  3600
```

### cocoisland.vn
```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
CNAME   www     cocoisland.vn   3600
```

---

## 🔐 SSL CERTIFICATES

### Setup with Let's Encrypt:
```bash
# For conphungtourist.com
sudo certbot --nginx -d conphungtourist.com -d www.conphungtourist.com

# For cocoisland.vn
sudo certbot --nginx -d cocoisland.vn -d www.cocoisland.vn
```

---

## 📊 ROUTING STRUCTURE

### Main Domain (conphungtourist.com)
```
/                   → Homepage
/tours              → Tours listing
/tours/[slug]       → Tour detail
/homestays          → Homestays listing
/homestays/[slug]   → Homestay detail
/posts              → Blog listing
/posts/[slug]       → Post detail
/cocoisland         → Coco Island homepage (accessible via subdomain too)
/cocoisland/rooms/[slug] → Room detail
```

### Subdomain (cocoisland.vn)
```
/                   → /cocoisland (proxied)
/rooms/[slug]       → /cocoisland/rooms/[slug] (proxied)
```

---

## 🔄 CROSS-DOMAIN LINKING

### In ConPhung Tourist:
```tsx
// Layout already has link to Coco Island
<Link href="https://cocoisland.vn">
  Đặt phòng Coco Island
</Link>
```

### In Coco Island:
```tsx
// Should have back link to main site
<Link href="https://conphungtourist.com">
  ← Về trang chủ ConPhung Tourist
</Link>
```

---

## ✅ CHECKLIST BEFORE GO LIVE

### Domain Setup:
- [ ] DNS records configured for conphungtourist.com
- [ ] DNS records configured for cocoisland.vn
- [ ] Both domains pointing to VPS IP

### SSL Setup:
- [ ] SSL certificate for conphungtourist.com
- [ ] SSL certificate for cocoisland.vn
- [ ] Auto-renewal configured

### Nginx Setup:
- [ ] Server block for conphungtourist.com
- [ ] Server block for cocoisland.vn
- [ ] HTTPS redirect from HTTP
- [ ] www redirect configured

### Application:
- [ ] NEXTAUTH_URL set to https://conphungtourist.com
- [ ] NEXT_PUBLIC_SITE_URL configured
- [ ] Images optimization for both domains
- [ ] Cross-domain links working

### SEO:
- [ ] Sitemap submitted for conphungtourist.com
- [ ] robots.txt accessible on both domains
- [ ] Google Search Console verified for both
- [ ] Analytics tracking both domains

---

## 🎯 RECOMMENDED APPROACH

**For Production**:
1. Deploy main app on conphungtourist.com
2. Point cocoisland.vn to /cocoisland route (same app)
3. Use Nginx to proxy cocoisland.vn → conphungtourist.com/cocoisland
4. This way:
   - Single deployment
   - Single codebase
   - Easier maintenance
   - Shared database & sessions

---

## 📞 TESTING AFTER DEPLOYMENT

### Check conphungtourist.com:
```bash
curl -I https://conphungtourist.com
# Should return 200 OK with SSL

curl https://conphungtourist.com/sitemap.xml
# Should return sitemap

curl https://conphungtourist.com/robots.txt
# Should return robots.txt
```

### Check cocoisland.vn:
```bash
curl -I https://cocoisland.vn
# Should return 200 OK with SSL

curl https://cocoisland.vn
# Should show Coco Island content
```

---

## 🔗 USEFUL LINKS

- **Main Site**: https://conphungtourist.com
- **Homestay Site**: https://cocoisland.vn
- **Admin Panel**: https://conphungtourist.com/admin
- **Sitemap**: https://conphungtourist.com/sitemap.xml
- **API**: https://conphungtourist.com/api

---

## 📝 NOTES

1. **Single Codebase**: Both domains served from same Next.js app
2. **Shared Database**: All data in one PostgreSQL database
3. **Separate Branding**: Different UI/UX for each domain
4. **Cross-Linking**: Natural links between the two sites
5. **SEO**: Each domain has own sitemap & robots.txt

---

**Status**: ✅ CONFIGURED & READY FOR DEPLOYMENT
