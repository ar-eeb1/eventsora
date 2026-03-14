'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useFetch from '@/hooks/useFetch'
import { PROVIDER_DASHBOARD, PROVIDER_STAFF_ADD } from '@/routes/ProviderPanelRoute'
import { UsersRound, Plus, Phone, Briefcase, Trash2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: '', label: 'Staff Management' },
]

const StaffPage = () => {
  const { data, loading } = useFetch('/api/provider/staff?start=0&size=100')

  const staff = data?.success && data.data && Array.isArray(data.data.staff) ? data.data.staff : []
  const total = data?.success && data.data ? data.data.totalRowCount ?? 0 : 0
  const router = useRouter()

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return
    try {
      const { data: resp } = await axios.delete(`/api/provider/staff?id=${id}`)
      if (!resp.success) throw new Error(resp.message)
      showToast('success', resp.message)
      router.refresh()
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message)
    }
  }

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    busy: 'bg-amber-100 text-amber-800',
    off: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="w-[calc(100%-1%)] mx-auto">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersRound className="w-6 h-6 text-pink-600" />
            <h4 className="text-xl font-semibold">Staff Management</h4>
          </div>
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link href={PROVIDER_STAFF_ADD} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Staff
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-16">
              <UsersRound className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No staff members yet</p>
              <Button asChild variant="outline">
                <Link href={PROVIDER_STAFF_ADD}>Add your first staff member</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <div
                  key={member._id}
                  className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-900">{member.fullName}</h5>
                    <Badge className={statusColors[member.availabilityStatus] || 'bg-gray-100'}>
                      {member.availabilityStatus}
                    </Badge>
                  </div>
                  {member.role && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Briefcase className="w-4 h-4" />
                      {member.role}
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t text-sm">
                    <span className="text-gray-500 capitalize">{member.salaryType?.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('_', ' ')}</span>
                    <span className="font-medium">
                      Rs {(member.salaryAmount || 0).toLocaleString('en-PK')}
                    </span>
                  </div>
                  {!member.isActive && (
                    <Badge variant="secondary" className="mt-2">Inactive</Badge>
                  )}
                  {/* actions */}
                  <div className="flex gap-2 mt-3">
                    <Link href={`/provider/staff/edit/${member._id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <UsersRound className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(member._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffPage
