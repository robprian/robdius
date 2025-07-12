# 🚀 Robdius - Panduan Lengkap Deploy ke Vercel

## 📋 Ringkasan Deployment

Robdius sekarang siap di-deploy ke Vercel dengan:
- **Database**: Supabase PostgreSQL
- **Cache**: Upstash Redis
- **Hosting**: Vercel

## 🔧 Langkah 1: Setup Supabase Database

### 1.1 Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Pilih organisasi atau buat baru
4. Masukkan detail project:
   - **Name**: `robdius`
   - **Database Password**: Buat password yang kuat
   - **Region**: `Southeast Asia (Singapore)` (untuk Indonesia)
5. Klik "Create new project"

### 1.2 Dapatkan Database URL
1. Masuk ke project Supabase
2. Pergi ke **Settings** → **Database**
3. Scroll ke bagian **Connection String**
4. Copy **URI** format
5. Format: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### 1.3 Konfigurasi Database
1. Pergi ke **Settings** → **API**
2. Copy **URL** dan **anon public key**
3. Copy **service_role key** (untuk admin operations)

## 🔧 Langkah 2: Setup Upstash Redis

### 2.1 Buat Database Redis
1. Kunjungi [upstash.com](https://upstash.com)
2. Klik "Create Database"
3. Pilih:
   - **Name**: `robdius-redis`
   - **Region**: `ap-southeast-1` (Singapore)
   - **Type**: `Regional`
4. Klik "Create"

### 2.2 Dapatkan Redis Credentials
1. Masuk ke dashboard Redis
2. Copy **REST URL** dan **REST Token**
3. Copy **Redis Connect URL**

## 🚀 Langkah 3: Deploy ke Vercel

### 3.1 Connect Repository
1. Kunjungi [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Import dari GitHub: `robprian/robdius`
4. Klik "Deploy"

### 3.2 Set Environment Variables
Di Vercel dashboard, pergi ke **Settings** → **Environment Variables** dan tambahkan:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis
UPSTASH_REDIS_REST_URL=https://[endpoint].upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
REDIS_URL=redis://default:[password]@[endpoint].upstash.io:6379

# Security (Generate random 32-character strings)
JWT_SECRET=your-32-character-jwt-secret-key
SESSION_SECRET=your-32-character-session-secret
ENCRYPTION_KEY=your-32-character-encryption-key
MIGRATION_SECRET=your-migration-secret

# App Configuration
NODE_ENV=production
APP_NAME=Robdius
APP_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app

# Email (Optional - untuk notifikasi)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp (Optional)
WHATSAPP_ENABLED=true
WHATSAPP_SESSION_NAME=robdius-session
```

### 3.3 Redeploy
Setelah set environment variables, klik **"Redeploy"**

## 📊 Langkah 4: Migrasi Database

### 4.1 Jalankan Migration
Setelah deploy sukses, jalankan migration:

```bash
curl -X POST https://your-app.vercel.app/api/migrate \
  -H "Authorization: Bearer your-migration-secret" \
  -H "Content-Type: application/json"
```

### 4.2 Verifikasi Migration
Response sukses akan terlihat seperti:
```json
{
  "success": true,
  "message": "Database migration completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Langkah 5: Test Aplikasi

### 5.1 Login Admin
- URL: `https://your-app.vercel.app/admin`
- Username: `admin`
- Password: `P4ks1m1n`
- Email: `robprian@gmail.com`

### 5.2 Test Fitur Utama
✅ Dashboard admin
✅ Customer management
✅ Plan management
✅ Router management
✅ Order processing
✅ Reports
✅ WhatsApp integration

## 🔍 Troubleshooting

### Database Connection Error
1. Pastikan DATABASE_URL benar
2. Cek password tidak mengandung karakter khusus
3. Set IP whitelist di Supabase ke `0.0.0.0/0`

### Redis Connection Error
1. Pastikan UPSTASH_REDIS_REST_URL dan TOKEN benar
2. Cek region compatibility

### Migration Error
1. Cek logs di Vercel dashboard
2. Pastikan semua environment variables ter-set
3. Cek database permissions

### App Error
1. Cek Vercel function logs
2. Pastikan NODE_ENV=production
3. Cek semua required env variables

## 📱 Akses Aplikasi

### Admin Panel
- URL: `https://your-app.vercel.app/admin`
- Features: Full admin dashboard

### Customer Panel
- URL: `https://your-app.vercel.app/customer`
- Features: Customer self-service

### API Endpoints
- Base URL: `https://your-app.vercel.app/api`
- Documentation: Available in app

## 🎉 Selesai!

Aplikasi Robdius sekarang sudah live di Vercel dengan:
- ✅ Database PostgreSQL (Supabase)
- ✅ Redis Cache (Upstash)
- ✅ Modern Node.js architecture
- ✅ WhatsApp integration
- ✅ Complete billing system
- ✅ Production-ready security

## 🆘 Butuh Bantuan?

Jika ada masalah:
1. Cek Vercel logs
2. Cek Supabase logs
3. Review environment variables
4. Pastikan semua credentials benar

**Happy billing! 🎯**
