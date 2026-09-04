# Hopenix Learning Portal — Enterprise Learning & Management System

**Hopenix** is a production-ready Learning Management System (LMS) built with **Next.js 16 (App Router)**, **TypeScript**, **React 19**, **Tailwind CSS**, **Prisma 7 ORM**, **Neon PostgreSQL**, **Auth.js/JWT Session Auth**, **Vercel Blob Storage**, **Zod**, and **Lucide React**.

---

## 🌟 Key Features

1. **Server-Side Role-Based Access Control (RBAC)**
   - **ADMIN**: Full management access (Courses, Lessons, Block Editor, User Management, Collaborator Assignment, QR Code Generation, Status Toggling).
   - **EDITOR**: Granular collaborator access. Editors can ONLY edit lessons where an Admin has explicitly assigned them via `LessonCollaborator`. Server-side permission check `canEditLesson(userId, lessonId)` is strictly enforced on all routes and server actions.
   - **STUDENT**: Read-only access to published courses, distraction-free lesson reader, video player, inline PDF viewer, downloadable resources, and QR code sharing.

2. **Strict Visual Design System (`design.md`)**
   - Main accent color: Warm Vibrant Orange (`#EA580C`)
   - Neutral foundation: `#525252` and `#171717`
   - Glassmorphism panels (`backdrop-filter: blur(4px)`)
   - Hairline gradient border shell around key cards and containers (`linear-gradient(135deg, ...)`)
   - Corner radius tokens: `2px` (surfaces & inputs) and `9999px` (pill buttons & badges)

3. **Block-Based Content Builder**
   - Reorderable content blocks:
     - **Text Block** (Rich HTML / Markdown with sanitization)
     - **Heading Block**
     - **Image Block** (Vercel Blob direct uploads with preview)
     - **Video Block** (Vercel Blob uploads or YouTube/Vimeo embeds)
     - **PDF Block** (Inline PDF viewer with metadata)
     - **File / Resource Block** (DOCX, XLSX, ZIP, TXT, PPTX attachments)
     - **Link Block**
     - **Divider Block**
     - **Callout Box**

4. **Dynamic QR Code Generator**
   - QR code modal for Course and Lesson URLs using `NEXT_PUBLIC_APP_URL`.
   - Download PNG or copy URL.

5. **Security & Profile Controls**
   - Idempotent database seed using `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`.
   - Passwords stored strictly as bcrypt hashes (`cost factor 12`).
   - Change Password feature available at `/profile/security`.

---

## 📂 Application Route Map

| Route | Role Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page featuring published course catalog |
| `/login` | Public | Login page with show/hide password and instant demo switcher |
| `/sign-up` | Public | Student account registration (defaults to `STUDENT` role) |
| `/dashboard` | Authenticated | Student Dashboard with welcome header, course catalog & progress |
| `/admin/dashboard` | ADMIN | Control center metrics (Total Courses, Lessons, Students, Editors) |
| `/admin/courses` | ADMIN | Course list, status toggling, and deletion |
| `/admin/courses/new` | ADMIN | Create new course |
| `/admin/courses/[id]/edit` | ADMIN | Edit course details |
| `/admin/lessons` | ADMIN | Lesson management table with search, course filter & QR modal |
| `/admin/lessons/new` | ADMIN | Create new lesson |
| `/admin/lessons/[id]/edit` | ADMIN | Full Block Builder Studio, settings & editor assignment |
| `/admin/users` | ADMIN | User management, search, role filters, and role promotions |
| `/editor/dashboard` | EDITOR / ADMIN | Displays **ONLY** lessons assigned to the logged-in editor |
| `/editor/lessons/[id]/edit` | EDITOR / ADMIN | Collaborator Block Builder (enforces server-side permission check) |
| `/courses` | Public / STUDENT | Student course catalog |
| `/courses/[courseSlug]` | Public / STUDENT | Course detail & lesson outline |
| `/courses/[courseSlug]/lessons/[lessonSlug]` | Public / STUDENT | Interactive lesson reader, video player, PDF preview & resources |
| `/profile` | Authenticated | User account profile summary |
| `/profile/security` | Authenticated | Change Password form (Current, New, Confirm New Password) |

---

## 🛠️ Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Neon PostgreSQL Database Connection Strings
DATABASE_URL="postgresql://user:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=verify-full"
DIRECT_URL="postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=verify-full"

# Session Secret (Generate a 32-character random string)
AUTH_SECRET="hopenix-production-jwt-secret-key-32-chars-long"

# Administrator Initial Credentials
ADMIN_EMAIL="admin@hopenix.com"
ADMIN_INITIAL_PASSWORD="admin123"

# Application Public Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel Blob Storage Token (For uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_example"
```

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Migrate database schema to Neon
npx prisma migrate dev --name init

# 4. Run idempotent seed script
npx prisma db seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Initial Admin Credentials:**
- Email: `admin@hopenix.com` (or your configured `ADMIN_EMAIL`)
- Initial Password: `admin123` (or your configured `ADMIN_INITIAL_PASSWORD`)
- *Please change the admin password immediately upon first sign-in via `/profile/security`.*

---

## 🌐 Production Deployment

Refer to [`DEPLOYMENT.md`](file:///c:/Work/BookPortal/book-portal/DEPLOYMENT.md) for full deployment instructions covering Neon PostgreSQL, Vercel Blob storage, environment variables, database migrations, and security audits.
