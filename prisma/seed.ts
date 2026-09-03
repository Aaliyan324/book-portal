import { prisma } from '../lib/db/prisma'
import { Role, CourseStatus, LessonStatus, BlockType } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting Hopenx LMS seeding...')

  // Clean existing data in reverse order of dependencies
  await prisma.resource.deleteMany()
  await prisma.media.deleteMany()
  await prisma.lessonCollaborator.deleteMany()
  await prisma.lessonBlock.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const editorPasswordHash = await bcrypt.hash('editor123', 10)
  const studentPasswordHash = await bcrypt.hash('student123', 10)

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'admin@hopenx.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
  })

  const editor1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'editor@hopenx.com',
      passwordHash: editorPasswordHash,
      role: Role.EDITOR,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    },
  })

  const editor2 = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@hopenx.com',
      passwordHash: editorPasswordHash,
      role: Role.EDITOR,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  })

  const student = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'student@hopenx.com',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    },
  })

  console.log('✅ Created Demo Users:')
  console.log(`- Admin: admin@hopenx.com / admin123`)
  console.log(`- Editor: editor@hopenx.com / editor123`)
  console.log(`- Student: student@hopenx.com / student123`)

  // 2. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Full-Stack Next.js 16 & Serverless Architecture',
      slug: 'fullstack-nextjs-serverless',
      description: 'Master modern full-stack development with Next.js App Router, Prisma ORM, Neon PostgreSQL, and serverless edge functions.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      status: CourseStatus.PUBLISHED,
      createdById: admin.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Systems & Micro-Interactions',
      slug: 'design-systems-micro-interactions',
      description: 'Build enterprise-grade design systems with Tailwind CSS, accessible components, smooth animations, and tokenized themes.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      status: CourseStatus.PUBLISHED,
      createdById: admin.id,
    },
  })

  // 3. Create Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Next.js App Router Architecture',
      slug: 'introduction-to-nextjs-app-router',
      description: 'Understand React Server Components, layout nesting, streaming SSR, and server actions in Next.js.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      status: LessonStatus.PUBLISHED,
      position: 1,
      estimatedDuration: 15,
      createdById: admin.id,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'Database Modeling with Prisma ORM & Neon Postgres',
      slug: 'database-modeling-prisma-neon',
      description: 'Design normalized relational database schemas, execute migrations, and build high-performance serverless queries.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
      status: LessonStatus.PUBLISHED,
      position: 2,
      estimatedDuration: 20,
      createdById: admin.id,
    },
  })

  const lesson3 = await prisma.lesson.create({
    data: {
      courseId: course2.id,
      title: 'Designing Cohesive Color Palettes & Dark Modes',
      slug: 'designing-cohesive-color-palettes',
      description: 'Learn how HSL tokens, semantic CSS variables, and elevation shadows create high-end SaaS user interfaces.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      status: LessonStatus.PUBLISHED,
      position: 1,
      estimatedDuration: 12,
      createdById: admin.id,
    },
  })

  // 4. Assign Collaborator/Editor
  await prisma.lessonCollaborator.create({
    data: {
      lessonId: lesson1.id,
      userId: editor1.id, // Sarah Jenkins can edit Lesson 1
    },
  })

  console.log(`✅ Assigned Editor Sarah Jenkins to Lesson: ${lesson1.title}`)

  // 5. Add Lesson Blocks to Lesson 1
  await prisma.lessonBlock.createMany({
    data: [
      {
        lessonId: lesson1.id,
        type: BlockType.HEADING,
        position: 1,
        content: 'Welcome to Next.js App Router Architecture',
        metadata: JSON.stringify({ level: 1 }),
      },
      {
        lessonId: lesson1.id,
        type: BlockType.CALLOUT,
        position: 2,
        content: 'Key Insight: React Server Components execute exclusively on the server, sending zero JavaScript bundle weight to the client browser.',
        metadata: JSON.stringify({ variant: 'info', icon: 'Lightbulb' }),
      },
      {
        lessonId: lesson1.id,
        type: BlockType.TEXT,
        position: 3,
        content: 'Next.js App Router introduces a paradigm shift in full-stack web applications. By defaulting every page and component to a Server Component, developers gain instant access to backend resources, database connections, and server security boundaries.',
      },
      {
        lessonId: lesson1.id,
        type: BlockType.IMAGE,
        position: 4,
        content: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        metadata: JSON.stringify({ caption: 'Modern full-stack application architecture workflow' }),
      },
      {
        lessonId: lesson1.id,
        type: BlockType.VIDEO,
        position: 5,
        content: 'https://www.youtube.com/watch?v=wm5gMKCORL4',
        metadata: JSON.stringify({ title: 'Overview of Next.js App Router Features' }),
      },
      {
        lessonId: lesson1.id,
        type: BlockType.DIVIDER,
        position: 6,
        content: '',
      },
      {
        lessonId: lesson1.id,
        type: BlockType.PDF,
        position: 7,
        content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        metadata: JSON.stringify({ fileName: 'Nextjs_App_Router_Architecture_Cheatsheet.pdf', size: 145000 }),
      },
    ],
  })

  // 6. Add Resources to Lesson 1
  await prisma.resource.create({
    data: {
      lessonId: lesson1.id,
      uploadedById: admin.id,
      title: 'App Router Starter Template (.zip)',
      url: 'https://raw.githubusercontent.com/vercel/next.js/canary/README.md',
      fileName: 'hopenx-nextjs-starter.zip',
      mimeType: 'application/zip',
      size: 5420000,
    },
  })

  console.log('✅ Created sample lesson blocks & downloadable resources')
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
