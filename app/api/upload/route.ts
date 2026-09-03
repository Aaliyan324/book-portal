import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getCurrentUser } from '@/lib/auth/session'

// Configurable maximum file sizes (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_PDF_SIZE = 25 * 1024 * 1024 // 25MB
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const ALLOWED_PDF_TYPES = ['application/pdf']
const ALLOWED_RESOURCE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
]

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role === 'STUDENT') {
      return NextResponse.json({ error: 'Students are not allowed to upload files' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as string) || 'file' // 'image' | 'video' | 'pdf' | 'resource'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate size and mime type based on category
    if (category === 'image') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid image type: ${file.type}. Allowed: PNG, JPG, WEBP, GIF, SVG` }, { status: 400 })
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Image exceeds maximum limit of 10MB' }, { status: 400 })
      }
    } else if (category === 'video') {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid video format: ${file.type}. Allowed: MP4, WEBM, MOV` }, { status: 400 })
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: 'Video exceeds maximum limit of 100MB' }, { status: 400 })
      }
    } else if (category === 'pdf') {
      if (!ALLOWED_PDF_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'File must be a valid PDF document' }, { status: 400 })
      }
      if (file.size > MAX_PDF_SIZE) {
        return NextResponse.json({ error: 'PDF exceeds maximum limit of 25MB' }, { status: 400 })
      }
    } else {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File exceeds maximum limit of 50MB' }, { status: 400 })
      }
    }

    let fileUrl = ''
    let storageKey = `hopenx/${category}/${Date.now()}-${file.name}`

    // If Vercel Blob Token is set, upload to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(storageKey, file, {
        access: 'public',
      })
      fileUrl = blob.url
      storageKey = blob.url
    } else {
      // Fallback for local development without token: return simulated data URL
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      fileUrl = `data:${file.type};base64,${base64}`
    }

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      storageKey,
    })
  } catch (error: any) {
    console.error('File Upload API Error:', error)
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 })
  }
}
