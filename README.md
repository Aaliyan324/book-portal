# Hopenx LMS — Enterprise Learning & Lesson Management Portal

**Hopenx** is a production-ready Learning Management Portal and Lesson Management System built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Neon PostgreSQL**, **Vercel Blob Storage**, **Zod**, and **Sonner**.

---

## 🌟 Key Features

1. **Server-Side Role-Based Access Control (RBAC)**
   - **ADMIN**: Full system access (Courses, Lessons, Block Editor, User Management, Collaborators Assignment, QR Generation, Deletion, Status Toggling).
   - **EDITOR**: Restricted collaborator access. Editors can only edit lessons where an Admin has explicitly assigned them. Attempting to access unassigned lessons returns HTTP 403 Forbidden on the server.
   - **STUDENT**: Read-only access to published courses, lessons, video streaming, inline PDF viewing, downloadable resources, and QR code sharing.

2. **Block-Based Lesson Builder**
   - Drag-and-drop / position reordering for dynamic content blocks:
     - **Text Block** (Rich HTML / Markdown with DOMPurify sanitization)
     - **Heading Block**
     - **Image Block** (PNG, JPG, WEBP upload via Vercel Blob with instant preview and replacement)
     - **Video Block** (Direct device upload via Vercel Blob or YouTube/Vimeo external embed)
     - **PDF Block** (Inline PDF viewer with metadata and download options)
     - **File / Resource Block** (DOCX, XLSX, ZIP, TXT, PPTX downloadable attachments)
     - **Link Block**
     - **Divider Block**
     - **Callout Box**

3. **Dynamic QR Code Generator**
   - Dynamic QR codes generated for every published course and lesson based on `NEXT_PUBLIC_APP_URL`.
   - Download QR Code as PNG or copy public URL to clipboard.

4. **Interactive Demo Role Switcher**
   - Top navigation header features an instant role switcher pill to evaluate the application as Admin, Editor, or Student without logging in/out repeatedly.

---

## 📂 Application Route Map

| Route | Role Access | Description |
| text | text | text |
| `/` | Public | Landing page featuring published course catalog |
| `/login` | Public | Sign In page with instant Demo Role switcher |
| `/sign-up` | Public | Student account registration |
| `/dashboard` | Authenticated | Smart router directing users based on their role |
| `/admin/dashboard` | ADMIN | Metrics dashboard (Courses, Lessons, Students, Editors, Uploads) |
| `/admin/courses` | ADMIN | Course list, status toggling, and deletion |
| `/admin/courses/new` | ADMIN | Create new course |
| `/admin/courses/[id]/edit` | ADMIN | Edit course details |
| `/admin/lessons` | ADMIN | Lesson management table with search, course/status filter, duplicate & QR modal |
| `/admin/lessons/new` | ADMIN | Create new lesson |
| `/admin/lessons/[id]/edit` | ADMIN | Full Block Builder Studio, settings & editor assignment |
| `/admin/users` | ADMIN | User management & role toggles (Admin, Editor, Student) |
| `/admin/editors` | ADMIN | Assigned editors directory |
| `/admin/students` | ADMIN | Student user directory |
| `/editor/dashboard` | EDITOR / ADMIN | Displays **ONLY** lessons assigned to the logged-in editor |
| `/editor/lessons/[id]/edit` | EDITOR / ADMIN | Collaborator Block Builder (enforces server-side permission check) |
| `/courses` | Public / STUDENT | Student course catalog |
| `/courses/[courseSlug]` | Public / STUDENT | Course detail & lesson outline |
| `/courses/[courseSlug]/lessons/[lessonSlug]` | Public / STUDENT | Interactive lesson reader, video player, PDF preview & resources |
| `/profile` | Authenticated | User account profile and assigned lessons summary |

---

## 🛠️ Environment Variables Checklist

Create a `.env` file in the root directory:

```env
# Neon PostgreSQL Database Connection Strings
DATABASE_URL="postgresql://neondb_owner:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secret Key for Session Cookies
JWT_SECRET="hopenx-production-jwt-secret-key-change-in-production-2026"

# Application Public Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel Blob Storage Token (For image, video, PDF, and resource uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_example"
```

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Prisma
Update `DATABASE_URL` in `.env` with your Neon PostgreSQL connection string, then run:

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to Neon
npx prisma db push
```

### 3. Seed Demo Data
Populate demo users, courses, lessons, blocks, and resources:

```bash
npx tsx prisma/seed.ts
```

**Preset Demo Accounts:**
- **Admin**: `admin@hopenx.com` / `admin123`
- **Editor**: `editor@hopenx.com` / `editor123`
- **Student**: `student@hopenx.com` / `student123`

### 4. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Vercel Deployment Instructions

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the required Environment Variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (Set to your Vercel deployment URL, e.g. `https://hopenx.vercel.app`)
   - `BLOB_READ_WRITE_TOKEN` (Connect Vercel Blob storage in Vercel Storage tab)
4. Click **Deploy**. Vercel will automatically build the project using Next.js Turbopack.

---

## 🗄️ Database Architecture (Prisma Schema)

- **`User`**: System accounts (`Role`: `ADMIN`, `EDITOR`, `STUDENT`)
- **`Course`**: Parent courses (`Status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`)
- **`Lesson`**: Course lessons with positions and estimated duration.
- **`LessonBlock`**: Reorderable content items (`Type`: `TEXT`, `HEADING`, `IMAGE`, `VIDEO`, `PDF`, `FILE`, `LINK`, `DIVIDER`, `CALLOUT`).
- **`LessonCollaborator`**: Many-to-many relationship granting specific editors access to specific lessons (`@@unique([lessonId, userId])`).
- **`Media`**: Metadata records for images, videos, and PDFs uploaded to Vercel Blob.
- **`Resource`**: Downloadable attachments (DOCX, XLSX, ZIP, PPTX, PDF).

---

## ✅ Core Feature Verification Checklist

- [x] Server-side RBAC (Admin, Editor, Student)
- [x] Admin Dashboard with metric cards & quick actions
- [x] Course & Lesson CRUD with draft/publish toggles
- [x] Reorderable Block-based lesson editor
- [x] Vercel Blob file upload API for images, videos, PDFs, resources
- [x] Lesson Collaborator assignment (Editors can only edit assigned lessons)
- [x] Student lesson viewer with sidebar navigation & video/PDF rendering
- [x] Dynamic QR Code generator for published lessons/courses
- [x] Instant Demo Role switcher header pill
- [x] Zero TypeScript & Build errors (`npm run build` succeeds cleanly)
