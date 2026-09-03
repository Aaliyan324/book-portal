# Hopenx LMS — User & Feature Operating Guide (`usage.md`)

Welcome to **Hopenx**, an enterprise-grade Learning Management Portal and Lesson Management System. This guide provides step-by-step instructions for using every feature across **Admin**, **Editor**, and **Student** user roles.

---

## 🚀 1. Quick Start & Accessing the Application

Start your local development server:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 🎭 Interactive Demo Role Switcher
In the top right corner of the navigation bar, use the floating **Role Switcher** pill to switch personas instantly without typing credentials:

- **Admin Button** (Blue): Swaps session to Alexander Wright (`admin@hopenx.com`)
- **Editor Button** (Purple): Swaps session to Sarah Jenkins (`editor@hopenx.com`)
- **Student Button** (Green): Swaps session to Elena Rostova (`student@hopenx.com`)

---

## 🛡️ 2. Administrator Guide (`ADMIN` Role)

Admins have full access across the entire application.

### A. Accessing Admin Dashboard
Navigate to `/admin/dashboard` or click **Admin Portal** in the navigation header.
- View real-time metric cards: *Total Courses*, *Total Lessons*, *Published Lessons*, *Draft Lessons*, *Total Editors*, and *Total Students*.
- Inspect *Recently Updated Lessons*, *Active Editors*, and *Recent File Uploads*.
- Use **Quick Create Course** or **Quick Create Lesson** header buttons.

### B. Course Management (`/admin/courses`)
1. Click **Create Course** -> Enter Title, Description, Thumbnail URL, and set status (*Draft* or *Published*).
2. Edit existing courses via the **Edit** action button.
3. Toggle publication status or delete courses directly from the management table.

### C. Lesson Creation & Block Builder Studio (`/admin/lessons`)
1. Click **Create Lesson** -> Select target Course, enter Title, Description, Estimated Duration (mins), and Status.
2. Click **Create Lesson & Open Block Builder** to launch the **Block Builder Studio**:
   - **Heading Block**: Add section headers.
   - **Text Block**: Add rich text/markdown (automatically sanitized via `DOMPurify` before rendering).
   - **Callout Box**: Highlight key takeaways or warning notes for students.
   - **Image Block**: Drag and drop or browse device images (PNG, JPG, WEBP) uploaded directly to Vercel Blob.
   - **Video Block**: Upload device video files (MP4, WEBM up to 100MB) OR paste external YouTube/Vimeo embed links.
   - **PDF Document Block**: Upload PDF documents with inline PDF iframe preview, filename, and download button.
   - **Resource Attachments**: Attach downloadable files (DOCX, XLSX, ZIP, TXT, PPTX).
   - **Reordering**: Click ↑ / ↓ arrows on any block to change its rendering position instantly.

### D. Managing Lesson Editors / Collaborators
1. In `/admin/lessons`, click **Manage** under the *Assigned Editors* column.
2. Search registered users by name or email.
3. Click **Assign** to grant a specific user permission to edit **only that lesson**.
4. Click **Remove** to revoke editing permissions immediately.

### E. Dynamic QR Code Generator
1. In `/admin/lessons` or on student lesson pages, click the **QR Code** icon or **Share QR Code** button.
2. Preview the dynamically generated QR code pointing to `NEXT_PUBLIC_APP_URL`.
3. Click **Copy URL** or **Download PNG** to save the QR graphic.

### F. User & Role Management (`/admin/users`)
1. Navigate to `/admin/users`.
2. Inspect registered users, avatars, email addresses, and joined dates.
3. Click **Toggle Role** to promote or demote users between `ADMIN`, `EDITOR`, and `STUDENT`.

---

## ✏️ 3. Lesson Editor Guide (`EDITOR` Role)

Editors have restricted collaborator access.

### A. Accessing Editor Studio (`/editor/dashboard`)
1. Click **Editor Studio** in the navigation header.
2. The dashboard displays **ONLY** lessons where an Administrator has explicitly added you as a collaborator.
3. View assigned lessons grouped by *Published* vs *Draft* status.

### B. Editing Assigned Lessons (`/editor/lessons/[lessonId]/edit`)
1. Click **Open Block Studio** on any assigned lesson card.
2. Update the lesson title, description, and save draft changes.
3. Add, edit, reorder, or delete content blocks (Headings, Text, Images, Videos, PDFs, Callouts).
4. Upload downloadable files to the **Attached Resources** panel.

> [!IMPORTANT]
> **Server Authorization Enforcement**:
> If an Editor manually types an unassigned lesson URL (e.g. `/editor/lessons/unassigned-id/edit`), the server executes [`requireLessonEditPermission`](file:///c:/Work/BookPortal/book-portal/lib/permissions/permissions.ts) and returns HTTP 403 Forbidden. Editors cannot delete lessons or manage user roles.

---

## 🎓 4. Student Guide (`STUDENT` Role)

Students enjoy a clean, read-only learning environment.

### A. Browsing Courses (`/courses`)
1. Click **Courses** in the navigation bar or visit `/courses`.
2. Browse published course cards displaying thumbnail banners, lesson counts, and author information.
3. Click **View Course Lessons** to open the course outline.

### B. Interactive Lesson Reader (`/courses/[courseSlug]/lessons/[lessonSlug]`)
1. Select a lesson from the **Course Outline** sidebar.
2. **Breadcrumb Navigation**: Easily jump back to Courses or Course details.
3. **Lesson Reader**: Read sanitized text, headings, and callout boxes.
4. **Media Player & PDF Viewer**: Watch embedded videos and view inline PDF documents directly inside the browser.
5. **Downloadable Resources**: Download course attachments (.zip, .pdf, .docx, .pptx) with single clicks.
6. **QR Code Sharing**: Click **Share QR Code** to view or scan the lesson QR code on mobile devices.
7. **Lesson Progression**: Click **Next Lesson** or **Previous Lesson** at the bottom of the page to navigate through the course.

---

## 📊 5. User Role Permission Matrix

| Feature / Action | ADMIN | EDITOR | STUDENT |
| text | text | text | text |
| View Published Courses & Lessons | ✅ | ✅ | ✅ |
| Scan / Share QR Codes | ✅ | ✅ | ✅ |
| Create Courses & Lessons | ✅ | ❌ | ❌ |
| Edit Assigned Lessons | ✅ | ✅ | ❌ |
| Edit Unassigned Lessons | ✅ | ❌ | ❌ |
| Delete Lessons or Courses | ✅ | ❌ | ❌ |
| Upload Images / Videos / PDFs | ✅ | ✅ | ❌ |
| Assign / Remove Editors | ✅ | ❌ | ❌ |
| Change User Roles | ✅ | ❌ | ❌ |
| Access `/admin` Routes | ✅ | ❌ | ❌ |
| Access `/editor` Routes | ✅ | ✅ (Assigned) | ❌ |
