#!/bin/bash
echo "🔧 Building Backend..."
cd /root/backend && npm install && npm run build

echo "🌐 Building Next.js..."
cd /root/conphung && npm install && npm run build

echo "🚀 Restarting all apps..."
pm2 reload ecosystem.config.js

echo "✅ Done! Backend + Next.js rebuilt and restarted successfully."