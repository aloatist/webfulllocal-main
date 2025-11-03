# 🚀 QUICK START - DEPLOY LÊN VPS (30 phút)

## Bước 1: Chuẩn bị (5 phút)

```bash
# Trong local machine
cd /Users/congtrinh/webfulllocal-main/conphung

# 1. Test build
npm run build

# 2. Nếu build OK, commit changes
git add .
git commit -m "Production ready with SEO optimizations"
git push origin main
```

## Bước 2: Setup VPS (10 phút)

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Quick install script
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs postgresql nginx
npm install -g pm2

# Setup PostgreSQL
sudo -u postgres psql << EOF
CREATE DATABASE conphung_db;
CREATE USER conphung_user WITH PASSWORD 'ChangeMe123!';
GRANT ALL PRIVILEGES ON DATABASE conphung_db TO conphung_user;
\q
EOF
```

## Bước 3: Deploy Code (10 phút)

```bash
# Clone project
cd /var/www
git clone YOUR_REPO_URL conphung
cd conphung/conphung

# Setup environment
cp .env.production.template .env.production
nano .env.production  # Sửa:
# - DATABASE_URL=postgresql://conphung_user:ChangeMe123!@localhost:5432/conphung_db
# - NEXTAUTH_URL=http://YOUR_VPS_IP:3000
# - NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Install & Build
npm ci
npx prisma migrate deploy
npx prisma generate
npm run db:seed
npm run build

# Start with PM2
pm2 start npm --name "conphung" -- start
pm2 startup
pm2 save
```

## Bước 4: Setup Nginx (5 phút)

```bash
# Tạo config
cat > /etc/nginx/sites-available/conphung << 'EOF'
server {
    listen 80;
    server_name YOUR_VPS_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/conphung /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## ✅ XONG! 

Website của bạn đã chạy tại: `http://YOUR_VPS_IP`

## 🔒 Sau khi test OK, setup domain + SSL:

```bash
# Point domain conphungtourist.com to VPS IP
# Then install SSL:
apt install -y certbot python3-certbot-nginx
certbot --nginx -d conphungtourist.com -d www.conphungtourist.com
```

## 📊 Monitor

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart conphung
```

---

**🎉 DONE! Website production ready!**
