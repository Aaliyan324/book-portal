# Hopenx LMS — Production Deployment Guide (Vercel + Neon + Vercel Blob)

This guide provides step-by-step instructions for deploying the **Hopenx Learning Management Portal** to **Vercel** with a **Neon PostgreSQL** serverless database and **Vercel Blob Storage**.

---

## 📋 Prerequisites Checklist

Before beginning deployment, ensure you have:

1. A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) repository containing the Hopenx source code.
2. A [Vercel](https://vercel.com) account.
3. A [Neon PostgreSQL](https://neon.tech) account.
4. Installed Node.js (v18+ or v20+) locally.

---

## 🗄️ Step 1: Set Up Neon PostgreSQL Database

1. Log in to [Neon Console](https://console.neon.tech).
2. Click **Create Project** and name it `hopenx-lms`.
3. Choose your preferred cloud region (e.g., `us-east-2` or `eu-central-1`).
4. Once created, copy both database connection strings from the Dashboard:
   - **Pooled connection string** (Used for `DATABASE_URL`):
     ```text
     postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=verify-full
     ```
   - **Direct connection string** (Used for `DIRECT_URL`):
     ```text
     postgresql://user:password@ep-cool-123456.us-east-2.aws.neon.tech/neondb?sslmode=verify-full
     ```

---

## 📦 Step 2: Initialize Database Schema & Seed Data

Run database migration and seeding commands locally or via terminal targeting your Neon database:

```bash
# Set your DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-cool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema tables to Neon PostgreSQL
npx prisma db push

# 3. Seed demo users, courses, lessons, and resources
npx tsx prisma/seed.ts
```

---

## 🪣 Step 3: Configure Vercel Blob Storage

1. Open your project in the [Vercel Dashboard](https://vercel.com).
2. Navigate to the **Storage** tab.
3. Click **Create Database** -> Select **Blob**.
4. Name your blob store `hopenx-media-store` and click **Create**.
5. Copy the generated read-write token:
   ```text
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
   ```

---

## 🌐 Step 4: Deploy to Vercel

### Method A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel New Project](https://vercel.com/new).
2. Import your Git repository (`book-portal` / `hopenx-lms`).
3. Under **Framework Preset**, select **Next.js**.
4. Expand **Environment Variables** and add the following:

| Key | Example Value | Description |
| text | text | text |
| `DATABASE_URL` | `postgresql://user:pass@ep-pooler.neon.tech/neondb?sslmode=require` | Neon Pooled DB URL |
| `DIRECT_URL` | `postgresql://user:pass@ep-direct.neon.tech/neondb?sslmode=require` | Neon Direct DB URL |
| `JWT_SECRET` | `hopenx-super-secret-jwt-key-32-chars-long` | Secret for HTTP-only cookies |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production domain for QR codes |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_rw_...` | Vercel Blob storage access token |

5. Click **Deploy**. Vercel will automatically run `npm run build` and launch your serverless deployment.

### Method B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Log in to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## 🔒 Step 5: Post-Deployment Verification Checklist

After deployment completes, open your production URL (e.g. `https://hopenx.vercel.app`) and verify:

- [x] **Landing Page**: Public catalog loads published courses.
- [x] **Admin Login**: Sign in with `admin@hopenx.com` / `admin123` -> Redirects to `/admin/dashboard`.
- [x] **Course & Lesson CRUD**: Create a lesson, add Heading/Text/Image/Video blocks, and save.
- [x] **Editor Permissions Test**:
  1. Assign `editor@hopenx.com` to Lesson A.
  2. Sign in as Editor -> Lesson A appears in `/editor/dashboard`.
  3. Attempting to directly access `/editor/lessons/[unassigned-id]/edit` returns HTTP 403 Forbidden.
- [x] **Student Viewing**: Sign in as Student (`student@hopenx.com`) -> Browse courses, view lesson blocks, play videos, preview inline PDFs, download attached resources.
- [x] **Dynamic QR Code**: Click **Share QR Code** on a published lesson -> Verify the generated QR code contains your production domain URL.

---

## 🔧 Database Migration Maintenance

When adding new fields or models in `prisma/schema.prisma` in future updates:

```bash
# 1. Create a migration file locally
npx prisma migrate dev --name describe_your_change

# 2. Deploy migrations to production Neon database
npx prisma migrate deploy
```

---

## 🆘 Troubleshooting

- **500 Database Connection Error**: Ensure `DATABASE_URL` includes `?sslmode=require` for Neon PostgreSQL.
- **Upload Failure**: Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel Environment Variables.
- **QR Code domain mismatch**: Set `NEXT_PUBLIC_APP_URL` in Vercel to your exact custom domain or `.vercel.app` URL without a trailing slash.
