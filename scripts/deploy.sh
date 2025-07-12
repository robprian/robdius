#!/bin/bash

# Robdius Deployment Script
echo "🚀 Starting Robdius deployment to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔑 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Create Supabase project and get DATABASE_URL"
echo "3. Create Upstash Redis and get UPSTASH_REDIS_REST_URL"
echo "4. Run database migration: curl -X POST https://your-app.vercel.app/api/migrate -H 'Authorization: Bearer migration-secret'"
echo ""
echo "🔗 Don't forget to check DEPLOY.md for detailed instructions!"
