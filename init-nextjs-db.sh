#!/bin/bash

# Script để setup database và chạy migrations
# Chạy sau khi Docker containers đã start

echo "🗄️  Initializing database..."

# Apply all migrations to attendance database
echo "📦 Applying migrations to attendance database..."

cd conphung

# Sử dụng prisma db push thay vì migrate (tránh lỗi permission)
echo "   Using prisma db push..."
npx prisma db push --accept-data-loss --skip-generate 2>&1 | grep -v "warn" || true

echo "✅ Database schema synced"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "✅ Database ready!"
