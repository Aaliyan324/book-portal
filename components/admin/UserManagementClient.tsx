'use client'

import { useState, useMemo } from 'react'
import { Role } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { updateUserRoleAction, deleteUserAction } from '@/actions/users'
import { Search, ShieldAlert, Trash2, ArrowLeft, ArrowRight, UserCheck, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface UserItem {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl: string | null
  createdAt: Date
  assignedCount: number
}

interface UserManagementClientProps {
  initialUsers: UserItem[]
  currentAdminId: string
}

export function UserManagementClient({ initialUsers, currentAdminId }: UserManagementClientProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const pageSize = 10

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [initialUsers, search, roleFilter])

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const handleRoleChange = async (userId: string, targetRole: Role) => {
    if (userId === currentAdminId && targetRole !== Role.ADMIN) {
      toast.error('You cannot remove your own administrative access.')
      return
    }

    if (targetRole === Role.ADMIN) {
      const confirmed = window.confirm(
        'SECURITY NOTICE: You are promoting this user to ADMIN. Admins have full access to manage all courses, users, and settings. Proceed?'
      )
      if (!confirmed) return
    }

    setIsUpdating(userId)
    try {
      await updateUserRoleAction(userId, targetRole)
      toast.success(`User role updated to ${targetRole}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user role'
      toast.error(msg)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentAdminId) {
      toast.error('You cannot delete your own admin account.')
      return
    }

    const confirmed = window.confirm(`Are you sure you want to delete account "${userName}"?`)
    if (!confirmed) return

    setIsUpdating(userId)
    try {
      await deleteUserAction(userId)
      toast.success(`User ${userName} deleted.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user'
      toast.error(msg)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#525252]" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#171717] whitespace-nowrap">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="h-10 px-3 rounded-[2px] border border-[#D4D4D4] bg-white text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            <option value="ALL">All Roles ({initialUsers.length})</option>
            <option value="ADMIN">Admins</option>
            <option value="EDITOR">Editors</option>
            <option value="STUDENT">Students</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block gradient-border-shell-card overflow-hidden">
        <div className="bg-white rounded-[4px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#D4D4D4] bg-[#E5E5E5]/30">
                <TableHead className="text-xs font-semibold text-[#171717]">User</TableHead>
                <TableHead className="text-xs font-semibold text-[#171717]">Current Role</TableHead>
                <TableHead className="text-xs font-semibold text-[#171717]">Assigned Lessons</TableHead>
                <TableHead className="text-xs font-semibold text-[#171717]">Joined Date</TableHead>
                <TableHead className="text-xs font-semibold text-[#171717] text-right">Role Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-[#525252]">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((u) => (
                  <TableRow key={u.id} className="border-b border-[#E5E5E5] hover:bg-[#E5E5E5]/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || `https://avatar.vercel.sh/${u.name}`}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover border border-[#D4D4D4]"
                        />
                        <div>
                          <p className="font-semibold text-sm text-[#171717]">{u.name}</p>
                          <p className="text-xs text-[#525252]">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          u.role === Role.ADMIN ? 'primary' : u.role === Role.EDITOR ? 'purple' : 'secondary'
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-[#525252]">
                      {u.assignedCount} lessons
                    </TableCell>

                    <TableCell className="text-xs text-[#525252]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== currentAdminId ? (
                          <>
                            {u.role === Role.STUDENT && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUpdating === u.id}
                                onClick={() => handleRoleChange(u.id, Role.EDITOR)}
                                className="text-xs border-[#D4D4D4] hover:bg-purple-50 hover:text-purple-700"
                              >
                                <UserCheck className="h-3.5 w-3.5 mr-1" /> Make Editor
                              </Button>
                            )}

                            {u.role === Role.EDITOR && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUpdating === u.id}
                                onClick={() => handleRoleChange(u.id, Role.STUDENT)}
                                className="text-xs border-[#D4D4D4] hover:bg-[#E5E5E5]"
                              >
                                Demote to Student
                              </Button>
                            )}

                            {u.role !== Role.ADMIN && (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={isUpdating === u.id}
                                onClick={() => handleRoleChange(u.id, Role.ADMIN)}
                                className="text-xs text-[#EA580C] hover:bg-[#EA580C]/10"
                                title="Promote to Admin (Protected Action)"
                              >
                                <Shield className="h-3.5 w-3.5 mr-1" /> Admin
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isUpdating === u.id}
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-[#EA580C] font-semibold flex items-center gap-1">
                            <ShieldAlert className="h-3.5 w-3.5" /> Current Admin
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Responsive Cards View (< 768px) */}
      <div className="block md:hidden space-y-3">
        {paginatedUsers.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#525252] bg-white border border-[#D4D4D4] rounded-[4px]">
            No users found matching your criteria.
          </div>
        ) : (
          paginatedUsers.map((u) => (
            <div key={u.id} className="p-4 rounded-[4px] border border-[#D4D4D4] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl || `https://avatar.vercel.sh/${u.name}`}
                    alt={u.name}
                    className="h-10 w-10 rounded-full object-cover border border-[#D4D4D4]"
                  />
                  <div>
                    <p className="font-bold text-sm text-[#171717]">{u.name}</p>
                    <p className="text-xs text-[#525252]">{u.email}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    u.role === Role.ADMIN ? 'primary' : u.role === Role.EDITOR ? 'purple' : 'secondary'
                  }
                >
                  {u.role}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-[#525252] pt-2 border-t border-[#E5E5E5]">
                <span>Assigned: {u.assignedCount} lessons</span>
                <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
              </div>

              {u.id !== currentAdminId && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E5E5]">
                  {u.role === Role.STUDENT && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isUpdating === u.id}
                      onClick={() => handleRoleChange(u.id, Role.EDITOR)}
                      className="flex-1 text-xs"
                    >
                      Make Editor
                    </Button>
                  )}
                  {u.role === Role.EDITOR && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isUpdating === u.id}
                      onClick={() => handleRoleChange(u.id, Role.STUDENT)}
                      className="flex-1 text-xs"
                    >
                      Make Student
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isUpdating === u.id}
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="text-xs px-3"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#525252]">
            Showing page {currentPage} of {totalPages} ({filteredUsers.length} total users)
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="text-xs px-3"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs px-3"
            >
              Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
