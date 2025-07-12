#!/bin/bash

# Deployment script for Robdius to Vercel
echo "🚀 Preparing Robdius for Vercel deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build if needed
echo "🏗️  Building project..."
npm run build || echo "⚠️  No build script found, skipping..."

# Check for required files
echo "🔍 Checking required files..."
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found."
    exit 1
fi

echo "✅ Project ready for deployment!"
echo ""
echo "🌐 Manual deployment steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Add environment variables:"
echo "   - DATABASE_URL: postgres://4cc549d11b5f6dc2b17f5524b71dd80a4d5b34f89dc723b0e9b1abde63b564ac:sk_vnJcP9gChI41QTPzknIIL@db.prisma.io:5432/?sslmode=require"
echo "   - POSTGRES_URL: postgres://4cc549d11b5f6dc2b17f5524b71dd80a4d5b34f89dc723b0e9b1abde63b564ac:sk_vnJcP9gChI41QTPzknIIL@db.prisma.io:5432/?sslmode=require"
echo "   - REDIS_URL: redis://default:xaN1y8tBmuNZppr8zQwVCoHncQtFmaQc@redis-15703.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com:15703"
echo "   - JWT_SECRET: your-super-secret-jwt-key-change-this-in-production-robdius-2024"
echo "   - SESSION_SECRET: your-super-secret-session-key-change-this-in-production-robdius-2024"
echo "   - NODE_ENV: production"
echo "5. Deploy!"
echo ""
echo "🎯 Project Name: robdius"
echo "🌍 Framework: Node.js"
echo "📂 Root Directory: /"
echo "🚀 Build Command: npm run build (or leave empty)"
echo "📁 Output Directory: . (or leave empty)"
echo "🔧 Install Command: npm install"
echo ""
echo "🔗 Your app will be available at: https://robdius.vercel.app"
