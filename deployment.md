# Hopenix Learning Portal — Production Deployment & Operations Guide

This guide provides step-by-step instructions for deploying the **Hopenix Learning Management Portal** to **Vercel** with a **Neon PostgreSQL** serverless database, **Auth.js/JWT session authentication**, and **Vercel Blob Storage**.

---

## 📋 Prerequisites Checklist

Before beginning deployment, ensure you have:

1. A [GitHub](https://github.com) or [GitLab](https://gitlab.com) repository containing your Hopenix codebase.
2. A [Vercel](https://vercel.com) account.
3. A [Neon PostgreSQL](https://neon.tech) database.
4. Installed Node.js (v18+ or v20+) locally.

---

## 🚀 STEP 1 — Install Dependencies & Local Verification

Clone the repository and install all dependencies:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser to verify local server launch.

---

## 🗄️ STEP 2 — Create Neon PostgreSQL Database

1. Log in to the [Neon Console](https://console.neon.tech).
2. Click **Create Project** and name it `hopenix-lms`.
3. Select your preferred region (e.g., `us-east-2` or `eu-central-1`).
4. Copy the connection strings from the Neon Dashboard:
   - **Pooled Connection String** (Used for `DATABASE_URL`):
     ```text
     postgresql://user:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=verify-full
     ```
   - **Direct Connection String** (Used for `DIRECT_URL`):
     ```text
     postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=verify-full
     ```

---

## 🔑 STEP 3 — Environment Configuration

Create a `.env.local` file in your root folder (never commit this file to Git):

```env
# Neon PostgreSQL Connection Strings
DATABASE_URL="postgresql://user:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=verify-full"
DIRECT_URL="postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=verify-full"

# Session Secret (Generate a 32-character random string)
AUTH_SECRET="hopenix-production-jwt-secret-key-32-chars-long"

# Administrator Initial Credentials
ADMIN_EMAIL="admin@hopenix.com"
ADMIN_INITIAL_PASSWORD="admin123"

# Application Base URL (Used for QR code generation)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel Blob Read-Write Token
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_example"
```

> [!IMPORTANT]
> Generate a secure secret for production using Node.js:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 📦 STEP 4 — Prisma Schema Generation & Idempotent Seed

Run database migration and seeding commands:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Synchronize schema to Neon PostgreSQL (uses DIRECT_URL in prisma.config.ts)
npx prisma db push

# 3. Execute initial database seed script
npx prisma db seed
```

Verify your database tables using Prisma Studio:
```bash
npx prisma studio
```

---

## 👑 STEP 5 — Admin Account Login & Password Change

1. Open `http://localhost:3000/login`.
2. Enter initial credentials:
   - **Email:** `admin@hopenix.com` (or your configured `ADMIN_EMAIL`)
   - **Password:** `admin123` (or your configured `ADMIN_INITIAL_PASSWORD`)
3. The password is automatically hashed with bcrypt (`cost factor 12`) upon seeding.
4. **Change initial password immediately**:
   - Navigate to `/profile/security`.
   - Enter your current password (`admin123`) and your new strong production password.

---

## 👤 STEP 6 — Test Student Account Registration

1. Open `/sign-up` or `/register` in an incognito window.
2. Fill out Full Name, Email, Password, Confirm Password.
3. Submit form. The user record is created with `role = STUDENT`.
4. Verify student cannot access `/admin` or `/editor` routes (redirected automatically by server authorization).

---

## ✏️ STEP 7 — Test Editor Roles & Lesson Permissions

1. Sign in as Admin (`admin@hopenix.com`).
2. Go to **Admin → Users** (`/admin/users`).
3. Find a registered student and click **Make Editor**.
4. Go to **Admin → Lessons** (`/admin/lessons`).
5. Click **Manage Editors** on a lesson and assign that editor.
6. Sign in as Editor (`editor@hopenix.com`):
   - Assigned lesson appears in Editor Studio (`/editor/dashboard`) and is editable (`/editor/lessons/[id]/edit`).
   - Unassigned lessons are forbidden server-side via `canEditLesson(userId, lessonId)`.

---

## 📚 STEP 8 — Test Course Creation, Media Uploads & QR Codes

1. As Admin, create a new course and lesson.
2. Upload image/video/PDF blocks (uses Vercel Blob).
3. Set status to `PUBLISHED`.
4. Click **Share QR Code** -> Verify QR opens student-facing course/lesson URL.
5. As Student, verify published course is viewable with responsive distraction-free viewer.

---

## 🐙 STEP 9 — Commit to GitHub Repository

Verify `.gitignore` contains `.env`, `.env.local`, `.env.production`.

```bash
git init
git add .
git commit -m "Prepare Hopenix Learning Portal for production deployment"
git remote add origin https://github.com/your-username/hopenix-lms.git
git push -u origin main
```

---

## 🌐 STEP 10 — Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository (`hopenix-lms`).
3. Framework Preset: **Next.js**.

---

## 🔐 STEP 11 — Configure Vercel Environment Variables

In Vercel Project Settings → **Environment Variables**, add:

| Key | Value Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled URL (`?sslmode=verify-full`) |
| `DIRECT_URL` | Neon PostgreSQL direct URL |
| `AUTH_SECRET` | 32-character random JWT secret |
| `ADMIN_EMAIL` | `admin@hopenix.com` |
| `ADMIN_INITIAL_PASSWORD` | Strong initial admin password |
| `NEXT_PUBLIC_APP_URL` | `https://your-hopenix.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Token (from Step 12) |

---

## 🪣 STEP 12 — Connect Vercel Blob Storage

1. In Vercel Project, navigate to **Storage** tab.
2. Click **Create Database** -> Select **Blob**.
3. Name your store `hopenix-blob-store`.
4. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into your environment variables.

---

## 🔗 STEP 13 — Set Production URL

Once Vercel assigns your production URL (e.g. `https://hopenix-learning.vercel.app`):
1. Update `NEXT_PUBLIC_APP_URL` in Vercel to `https://hopenix-learning.vercel.app`.
2. Redeploy if necessary. QR codes will now generate production links.

---

## 🗃️ STEP 14 — Production Database Deployment

Run production-safe database deployment:

```bash
npx prisma migrate deploy
```

> [!WARNING]
> Never run `prisma db push --force-reset` or `prisma migrate dev` against production database to avoid erasures.

---

## 🛡️ Security Audit Checklist

- [x] **No Hardcoded Passwords**: Passwords stored as bcrypt hashes (`cost factor 12`).
- [x] **Role Security**: Registration defaults to `STUDENT`. Role promotion restricted to Admins.
- [x] **Server Action Authorization**: Every server action verifies current user identity via `getCurrentUser()` and enforces permission level.
- [x] **Lesson Isolation**: Editors can ONLY edit lessons explicitly assigned via `LessonCollaborator`.
- [x] **Protected Routes**: `/admin/**`, `/editor/**`, `/profile/**` protected via `proxy.ts` middleware and server functions.
- [x] **Password Update**: Change password feature available at `/profile/security`.

---

## 📱 Responsive Design Checklist

- [x] **Mobile Login & Sign Up (320px–430px)**: Single-column clean layout with show/hide password toggle.
- [x] **Mobile Admin & Users View**: Tables transform to responsive cards; drawer sidebar with backdrop click.
- [x] **Distraction-Free Student Lesson Viewer**: Collapsible mobile course contents drawer (`MobileCourseDrawer`) preventing horizontal scrolling.
