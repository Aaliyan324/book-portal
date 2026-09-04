'use client'

import { useState, useEffect, useCallback } from 'react'
import { Role } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { searchUsersAction, addCollaboratorAction, removeCollaboratorAction } from '@/actions/collaborators'
import { Search, UserPlus, UserMinus, Loader2, Check, Users } from 'lucide-react'
import { toast } from 'sonner'

interface CollaboratorUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl: string | null
}

interface ManageEditorsDialogProps {
  isOpen: boolean
  onClose: () => void
  lessonId: string
  lessonTitle: string
  initialCollaborators: CollaboratorUser[]
}

export function ManageEditorsDialog({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  initialCollaborators,
}: ManageEditorsDialogProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CollaboratorUser[]>([])
  const [assigned, setAssigned] = useState<CollaboratorUser[]>(initialCollaborators)
  const [isLoading, setIsLoading] = useState(false)
  const [actionUserId, setActionUserId] = useState<string | null>(null)

  useEffect(() => {
    setAssigned(initialCollaborators)
  }, [initialCollaborators])

  const handleSearch = useCallback(async (q: string) => {
    setIsLoading(true)
    try {
      const results = await searchUsersAction(q)
      setSearchResults(results)
    } catch {
      toast.error('Failed to search users')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      handleSearch(query)
    }
  }, [isOpen, query, handleSearch])

  const isAssigned = (userId: string) => assigned.some((u) => u.id === userId)

  const handleAssign = async (user: CollaboratorUser) => {
    setActionUserId(user.id)
    try {
      await addCollaboratorAction(lessonId, user.id)
      setAssigned((prev) => [...prev, user])
      toast.success(`Assigned ${user.name} to lesson "${lessonTitle}"`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to assign editor'
      toast.error(msg)
    } finally {
      setActionUserId(null)
    }
  }

  const handleRemove = async (userId: string, userName: string) => {
    setActionUserId(userId)
    try {
      await removeCollaboratorAction(lessonId, userId)
      setAssigned((prev) => prev.filter((u) => u.id !== userId))
      toast.success(`Removed ${userName} from lesson`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove editor'
      toast.error(msg)
    } finally {
      setActionUserId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-white border border-[#D4D4D4] rounded-[4px] space-y-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#171717] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#EA580C]" /> Manage Editors
          </DialogTitle>
          <DialogDescription className="text-xs text-[#525252]">
            Assign editors to collaborate on lesson: <span className="font-semibold text-[#171717]">&quot;{lessonTitle}&quot;</span>
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#525252]" />
          <Input
            placeholder="Search editors by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Assigned Editors Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Assigned Editors ({assigned.length})
          </h4>
          {assigned.length === 0 ? (
            <p className="text-xs text-[#525252] italic bg-[#E5E5E5]/40 p-3 rounded-[2px]">
              No editors assigned yet. Search below to add editors.
            </p>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {assigned.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-[2px] border border-[#D4D4D4] bg-white text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl || `https://avatar.vercel.sh/${u.name}`}
                      alt={u.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-[#171717]">{u.name}</p>
                      <p className="text-[10px] text-[#525252]">{u.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionUserId === u.id}
                    onClick={() => handleRemove(u.id, u.name)}
                    className="h-7 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    {actionUserId === u.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <UserMinus className="h-3 w-3 mr-1" /> Remove
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Search Results */}
        <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Available Users
          </h4>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#EA580C]" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="text-xs text-[#525252] py-4 text-center">No matching users found.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {searchResults.map((u) => {
                const assignedAlready = isAssigned(u.id)
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2.5 rounded-[2px] border border-[#E5E5E5] bg-[#E5E5E5]/10 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl || `https://avatar.vercel.sh/${u.name}`}
                        alt={u.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-[#171717]">{u.name}</p>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                            {u.role}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-[#525252]">{u.email}</p>
                      </div>
                    </div>

                    {assignedAlready ? (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Assigned
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionUserId === u.id}
                        onClick={() => handleAssign(u)}
                        className="h-7 text-[11px] border-[#D4D4D4] hover:bg-[#EA580C]/10 hover:text-[#EA580C]"
                      >
                        {actionUserId === u.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-1" /> Assign Editor
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
