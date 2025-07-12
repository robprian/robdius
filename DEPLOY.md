# 🚀 Deploy Robdius ke Vercel dengan Supabase & Upstash

## Langkah 1: Setup Supabase Database

1. **Buat project Supabase:**
   - Kunjungi [supabase.com](https://supabase.com)
   - Buat project baru
   - Pilih region yang dekat dengan target user (Singapore untuk Indonesia)

2. **Dapatkan kredensial database:**
   - Masuk ke project Supabase
   - Pergi ke Settings → Database
   - Copy Connection String (URI format)
   - Format: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

## Langkah 2: Setup Upstash Redis

1. **Buat database Redis:**
   - Kunjungi [upstash.com](https://upstash.com)
   - Buat database Redis baru
   - Pilih region yang sama dengan Supabase

2. **Dapatkan kredensial Redis:**
   - Copy REST URL dan REST Token
   - Format: `https://[endpoint].upstash.io`

## Langkah 3: Deploy ke Vercel

1. **Connect repository ke Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login ke Vercel
   vercel login
   
   # Deploy dari terminal
   vercel
   ```

2. **Set environment variables di Vercel:**
   - Masuk ke dashboard Vercel
   - Pilih project Robdius
   - Pergi ke Settings → Environment Variables
   - Add semua variable dari file `.env.production`

## Langkah 4: Environment Variables yang Diperlukan

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis
UPSTASH_REDIS_REST_URL=https://[endpoint].upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
REDIS_URL=redis://:[password]@[endpoint].upstash.io:6379

# Security
JWT_SECRET=your-32-character-secret
SESSION_SECRET=your-32-character-secret
ENCRYPTION_KEY=your-32-character-key

# App
NODE_ENV=production
APP_URL=https://your-app.vercel.app
```

## Langkah 5: Migrasi Database

Setelah deploy, jalankan migrasi:

```bash
# Lewat Vercel Function atau manual
curl -X POST https://your-app.vercel.app/api/migrate
```

## Langkah 6: Test Aplikasi

1. **Login Admin:**
   - Username: `admin`
   - Password: `P4ks1m1n`
   - Email: `robprian@gmail.com`

2. **Test fitur utama:**
   - Dashboard admin
   - Customer management
   - Plan management
   - WhatsApp integration
   - Reports

## Troubleshooting

### Database Connection Error
- Pastikan DATABASE_URL benar
- Cek IP whitelist di Supabase (set ke 0.0.0.0/0 untuk Vercel)

### Redis Connection Error
- Pastikan credentials Upstash benar
- Pastikan TLS enabled

### Migration Error
- Cek database permissions
- Pastikan semua environment variables ter-set

## Commands Berguna

```bash
# Deploy ulang
vercel --prod

# Lihat logs
vercel logs

# Set environment variable
vercel env add [name]

# Pull environment variables
vercel env pull .env.local
```

## Support

Jika ada masalah, cek:
1. Vercel dashboard untuk logs
2. Supabase dashboard untuk database activity
3. Upstash dashboard untuk Redis metrics
