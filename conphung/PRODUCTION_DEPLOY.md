# 🚀 HƯỚNG DẪN DEPLOY LÊN VPS - PRODUCTION READY

## 📋 Checklist Trước Khi Deploy

### 1. Environment Variables
- [ ] Copy `.env.production.template` thành `.env.production`
- [ ] Thay `NEXTAUTH_SECRET` bằng key random 32 ký tự
- [ ] Cập nhật `DATABASE_URL` production
- [ ] Cập nhật `NEXTAUTH_URL` thành domain thật
- [ ] Thêm Cloudinary credentials nếu dùng

### 2. Database
- [ ] Backup database hiện tại
- [ ] Chạy migrations trên production: `npx prisma migrate deploy`
- [ ] Chạy seed nếu cần: `npm run db:seed`

### 3. Build & Test
```bash
# Test build locally
npm run build

# Check for errors
npm run type-check
npm run lint
```

### 4. Performance Optimization
- [ ] Enable gzip compression trên nginx/apache
- [ ] Setup CDN cho static assets (Cloudflare, etc.)
- [ ] Enable HTTP/2 trên web server
- [ ] Setup SSL certificate (Let's Encrypt)

---

## 🖥️ VPS Setup - Ubuntu/Debian

### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Setup PostgreSQL
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE conphung_db;
CREATE USER conphung_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE conphung_db TO conphung_user;
\q
```

### 3. Clone & Setup Project
```bash
# Clone repository
cd /var/www
git clone your-repo-url conphung
cd conphung/conphung

# Install dependencies
npm ci --production=false

# Setup environment
cp .env.production.template .env.production
nano .env.production  # Edit with your values

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Build
npm run build
```

### 4. PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conphung-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/conphung/conphung',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Auto-restart on reboot
pm2 startup
pm2 save
```

### 5. Nginx Configuration
```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/conphungtourist.com
```

Paste this configuration:
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name conphungtourist.com www.conphungtourist.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name conphungtourist.com www.conphungtourist.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/conphungtourist.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conphungtourist.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Max upload size
    client_max_body_size 10M;

    # Static files cache
    location /_next/static {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main location
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/conphungtourist.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d conphungtourist.com -d www.conphungtourist.com
```

### 7. Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 🔄 CI/CD với GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/conphung/conphung
          git pull origin main
          npm ci --production=false
          npx prisma migrate deploy
          npm run build
          pm2 reload ecosystem.config.js
```

---

## 📊 Monitoring

### 1. PM2 Monitoring
```bash
# View logs
pm2 logs

# Monitor CPU/Memory
pm2 monit

# Check status
pm2 status
```

### 2. Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🛡️ Security Best Practices

1. **Never commit `.env.production`** to git
2. **Use strong passwords** for database
3. **Keep system updated**: `sudo apt update && sudo apt upgrade`
4. **Setup fail2ban** to prevent brute force
5. **Regular backups** of database
6. **Monitor logs** regularly
7. **Use HTTPS only**
8. **Rate limiting** on API routes

---

## 📈 Performance Tips

1. **CDN**: Use Cloudflare for static assets
2. **Image Optimization**: Already configured in Next.js
3. **Database Connection Pool**: Configured in Prisma
4. **Caching**: Nginx caching for static files
5. **Compression**: Gzip enabled
6. **HTTP/2**: Enabled in nginx config

---

## 🔧 Troubleshooting

### Application won't start
```bash
pm2 logs  # Check for errors
```

### High memory usage
```bash
# Reduce PM2 instances
pm2 scale conphung-frontend 2
```

### Database connection issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U conphung_user -d conphung_db -h localhost
```

---

## ✅ Post-Deploy Checklist

- [ ] Website accessible via HTTPS
- [ ] SSL certificate valid
- [ ] All pages loading correctly
- [ ] Images loading properly
- [ ] Forms working (booking, contact)
- [ ] Admin panel accessible
- [ ] Database migrations applied
- [ ] PM2 auto-restart configured
- [ ] Nginx logs clean
- [ ] Analytics tracking working
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible
- [ ] Performance score > 90 (Google PageSpeed)
