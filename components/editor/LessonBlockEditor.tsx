'use client'

import * as React from 'react'
import { BlockType } from '@prisma/client'
import { addBlockAction, updateBlockAction, deleteBlockAction, reorderBlocksAction } from '@/actions/blocks'
import { ImageUploader } from '@/components/uploads/ImageUploader'
import { VideoUploader } from '@/components/uploads/VideoUploader'
import { PdfUploader } from '@/components/uploads/PdfUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import DOMPurify from 'isomorphic-dompurify'
import {
  Type,
  Heading as HeadingIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Link2,
  Minus,
  AlertCircle,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  Check,
  Sparkles,
  GripVertical,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface LessonBlock {
  id: string
  lessonId: string
  type: BlockType
  position: number
  content: string
  metadata?: string | null
}

interface LessonBlockEditorProps {
  lessonId: string
  initialBlocks: LessonBlock[]
  readOnly?: boolean
}

export function LessonBlockEditor({ lessonId, initialBlocks, readOnly = false }: LessonBlockEditorProps) {
  const [blocks, setBlocks] = React.useState<LessonBlock[]>(initialBlocks)
  const [addingType, setAddingType] = React.useState<BlockType | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const handleAddBlock = (type: BlockType) => {
    let initialContent = ''
    let initialMetadata = ''

    if (type === BlockType.HEADING) initialContent = 'New Heading'
    if (type === BlockType.TEXT) initialContent = '<p>Write your detailed lesson text here...</p>'
    if (type === BlockType.CALLOUT) {
      initialContent = 'Important note or takeaway for students.'
      initialMetadata = JSON.stringify({ variant: 'info' })
    }
    if (type === BlockType.LINK) {
      initialContent = 'https://example.com'
      initialMetadata = JSON.stringify({ title: 'External Documentation' })
    }

    startTransition(async () => {
      try {
        const res = await addBlockAction({
          lessonId,
          type,
          content: initialContent,
          metadata: initialMetadata,
        })
        setBlocks((prev) => [...prev, res.block as unknown as LessonBlock])
        setAddingType(null)
        toast.success(`Added ${type.toLowerCase()} block`)
      } catch (err: any) {
        toast.error(err.message || 'Failed to add block')
      }
    })
  }

  const handleUpdateBlock = (blockId: string, content: string, metadata?: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content, metadata: metadata !== undefined ? metadata : b.metadata } : b))
    )

    startTransition(async () => {
      try {
        await updateBlockAction(blockId, lessonId, { content, metadata })
        toast.success('Block updated')
      } catch (err: any) {
        toast.error(err.message || 'Failed to update block')
      }
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return

    startTransition(async () => {
      try {
        await deleteBlockAction(blockId, lessonId)
        setBlocks((prev) => prev.filter((b) => b.id !== blockId))
        toast.success('Block deleted')
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete block')
      }
    })
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp

    // Update position indexes
    const reordered = newBlocks.map((b, idx) => ({ ...b, position: idx + 1 }))
    setBlocks(reordered)

    startTransition(async () => {
      try {
        await reorderBlocksAction(
          lessonId,
          reordered.map((b) => ({ id: b.id, position: b.position }))
        )
        toast.success('Blocks reordered')
      } catch (err: any) {
        toast.error(err.message || 'Failed to reorder blocks')
      }
    })
  }

  const renderBlockContent = (block: LessonBlock) => {
    const isEditing = editingBlockId === block.id

    switch (block.type) {
      case BlockType.HEADING:
        return isEditing && !readOnly ? (
          <div className="flex gap-2">
            <Input
              value={block.content}
              onChange={(e) => setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, content: e.target.value } : b)))}
              className="text-xl font-bold"
            />
            <Button size="sm" onClick={() => { handleUpdateBlock(block.id, block.content); setEditingBlockId(null); }}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <h2
            onClick={() => !readOnly && setEditingBlockId(block.id)}
            className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            {block.content || 'Untitled Heading'}
          </h2>
        )

      case BlockType.TEXT:
        return isEditing && !readOnly ? (
          <div className="space-y-2">
            <Textarea
              rows={5}
              value={block.content}
              onChange={(e) => setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, content: e.target.value } : b)))}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => { handleUpdateBlock(block.id, block.content); setEditingBlockId(null); }}>
                <Save className="h-4 w-4 mr-1" /> Save Text
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !readOnly && setEditingBlockId(block.id)}
            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
          />
        )

      case BlockType.CALLOUT: {
        let meta = { variant: 'info' }
        try { meta = block.metadata ? JSON.parse(block.metadata) : meta } catch {}

        return (
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-4 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              {!readOnly && isEditing ? (
                <Textarea
                  value={block.content}
                  onChange={(e) => setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, content: e.target.value } : b)))}
                  onBlur={() => { handleUpdateBlock(block.id, block.content); setEditingBlockId(null); }}
                  rows={2}
                />
              ) : (
                <p onClick={() => !readOnly && setEditingBlockId(block.id)} className="text-sm font-medium cursor-pointer">
                  {block.content}
                </p>
              )}
            </div>
          </div>
        )
      }

      case BlockType.IMAGE:
        return (
          <div className="space-y-2">
            {!readOnly ? (
              <ImageUploader
                value={block.content}
                onChange={(url) => handleUpdateBlock(block.id, url)}
              />
            ) : block.content ? (
              <img src={block.content} alt="Lesson illustration" className="w-full max-h-[500px] object-cover rounded-2xl border border-slate-200 dark:border-slate-800" />
            ) : null}
          </div>
        )

      case BlockType.VIDEO:
        return (
          <div className="space-y-2">
            {!readOnly ? (
              <VideoUploader
                value={block.content}
                onChange={(url) => handleUpdateBlock(block.id, url)}
              />
            ) : block.content ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
                {block.content.includes('youtube.com') || block.content.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${block.content.split('v=')[1]?.split('&')[0] || block.content.split('/').pop()}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={block.content} controls className="w-full h-full" />
                )}
              </div>
            ) : null}
          </div>
        )

      case BlockType.PDF: {
        let meta = { fileName: '', size: 0 }
        try { meta = block.metadata ? JSON.parse(block.metadata) : meta } catch {}

        return (
          <div className="space-y-2">
            {!readOnly ? (
              <PdfUploader
                value={block.content}
                fileName={meta.fileName}
                size={meta.size}
                onChange={(url, newMeta) =>
                  handleUpdateBlock(block.id, url, newMeta ? JSON.stringify(newMeta) : undefined)
                }
              />
            ) : block.content ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {meta.fileName || 'PDF Document'}
                    </span>
                  </div>
                  <a href={block.content} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">View PDF</Button>
                  </a>
                </div>
                <iframe src={block.content} className="w-full h-72 rounded-xl border border-slate-200 dark:border-slate-800" title="PDF viewer" />
              </div>
            ) : null}
          </div>
        )
      }

      case BlockType.DIVIDER:
        return <hr className="my-4 border-slate-200 dark:border-slate-800" />

      case BlockType.LINK:
        return (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
              <Link2 className="h-4 w-4" />
              <a href={block.content} target="_blank" rel="noreferrer" className="hover:underline">
                {block.content}
              </a>
            </div>
            {!readOnly && (
              <Button size="sm" variant="ghost" onClick={() => setEditingBlockId(block.id)}>
                Edit Link
              </Button>
            )}
          </div>
        )

      default:
        return <p className="text-sm text-slate-500">{block.content}</p>
    }
  }

  return (
    <div className="space-y-6">
      {/* Block List */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              This lesson has no content blocks yet.
            </p>
            <p className="text-xs text-slate-400">
              Click &quot;Add Block&quot; below to add Headings, Rich Text, Images, Videos, or PDFs.
            </p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
            >
              {!readOnly && (
                <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm z-10">
                  <button
                    onClick={() => handleMoveBlock(index, 'up')}
                    disabled={index === 0 || isPending}
                    className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                    title="Move block up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveBlock(index, 'down')}
                    disabled={index === blocks.length - 1 || isPending}
                    className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                    title="Move block down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    disabled={isPending}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Delete block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {renderBlockContent(block)}
            </div>
          ))
        )}
      </div>

      {/* Add Content Toolbar */}
      {!readOnly && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Lesson Block
          </h4>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.HEADING)}>
              <HeadingIcon className="h-4 w-4 mr-1.5 text-blue-600" /> Heading
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.TEXT)}>
              <Type className="h-4 w-4 mr-1.5 text-slate-600" /> Text
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.CALLOUT)}>
              <AlertCircle className="h-4 w-4 mr-1.5 text-amber-500" /> Callout Box
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.IMAGE)}>
              <ImageIcon className="h-4 w-4 mr-1.5 text-emerald-600" /> Image
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.VIDEO)}>
              <VideoIcon className="h-4 w-4 mr-1.5 text-purple-600" /> Video
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.PDF)}>
              <FileText className="h-4 w-4 mr-1.5 text-rose-600" /> PDF Document
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleAddBlock(BlockType.DIVIDER)}>
              <Minus className="h-4 w-4 mr-1.5 text-slate-400" /> Divider
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
