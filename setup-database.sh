#!/bin/bash

# Script setup database một lần duy nhất
# Chạy: ./setup-database.sh

set -e

echo "🗄️  Setting up database for Next.js app..."

# Start only postgres
echo "Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for postgres
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Create dedicated database for Next.js
echo "Creating conphung_db database..."
docker exec webfulllocal-main-postgres-1 psql -U attendance -d postgres -c "CREATE DATABASE conphung_db OWNER attendance;" 2>/dev/null || echo "Database already exists"

# Grant all permissions
echo "Granting permissions..."
docker exec webfulllocal-main-postgres-1 psql -U attendance -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE conphung_db TO attendance;"

# Connect to the new database and grant schema permissions
docker exec webfulllocal-main-postgres-1 psql -U attendance -d conphung_db -c "GRANT ALL ON SCHEMA public TO attendance;"
docker exec webfulllocal-main-postgres-1 psql -U attendance -d conphung_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO attendance;"
docker exec webfulllocal-main-postgres-1 psql -U attendance -d conphung_db -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO attendance;"

echo "✅ Database conphung_db created with full permissions"

# Update .env file
echo "Updating .env file..."
cd conphung
sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=postgresql://attendance:attendance@localhost:5432/conphung_db|g' .env
rm -f .env.bak

echo "✅ .env updated"

# Run prisma db push to create all tables
echo "Creating database schema..."
npx prisma db push --accept-data-loss

echo "✅ Database schema created"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Database: conphung_db"
echo "Tables: All Prisma models created"
echo ""
echo "Next steps:"
echo "1. Run: ./dev-start.sh"
echo "2. Open: http://localhost:3000/admin/homepage"
echo "3. Test CMS!"
echo ""
