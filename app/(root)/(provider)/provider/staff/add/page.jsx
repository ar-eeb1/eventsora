'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { PROVIDER_DASHBOARD, PROVIDER_STAFF_SHOW } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Select from '@/components/application/Main/Select'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_STAFF_SHOW, label: 'Staff' },
  { href: '', label: 'Add Staff' },
]

const staffFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  role: z.string().optional(),
  salaryType: z.enum(['monthly', 'per_event']),
  salaryAmount: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  availabilityStatus: z.enum(['available', 'busy', 'off']),
})

const AddStaff = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      role: '',
      salaryType: 'monthly',
      salaryAmount: 0,
      isActive: true,
      availabilityStatus: 'available',
    },
  })

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/provider/staff', values)
      if (!response.success) throw new Error(response.message)
      showToast('success', response.message)
      router.push(PROVIDER_STAFF_SHOW)
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { label: 'Waiter', value: 'waiter' },
    { label: 'Photographer', value: 'photographer' },
    { label: 'Decorator', value: 'decorator' },
    { label: 'Driver', value: 'driver' },
    { label: 'Chef', value: 'chef' },
    { label: 'Other', value: 'other' },
  ]

  const salaryTypeOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Per Event', value: 'per_event' },
  ]

  const availabilityOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Busy', value: 'busy' },
    { label: 'Off', value: 'off' },
  ]

  return (
    <div className="w-[calc(100%-1%)] mx-auto">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="px-6 border-b">
          <h4 className="text-xl font-semibold">Add Staff Member</h4>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        options={roleOptions}
                        selected={field.value || ''}
                        setSelected={(v) => field.onChange(v || '')}
                        isMulti={false}
                        placeholder="Select role (e.g. waiter, photographer)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Type</FormLabel>
                    <FormControl>
                      <Select
                        options={salaryTypeOptions}
                        selected={field.value}
                        setSelected={field.onChange}
                        isMulti={false}
                        placeholder="Select salary type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Amount (Rs)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Status</FormLabel>
                    <FormControl>
                      <Select
                        options={availabilityOptions}
                        selected={field.value}
                        setSelected={field.onChange}
                        isMulti={false}
                        placeholder="Select status"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Add Staff"
                  className="bg-pink-600 hover:bg-pink-700"
                />
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddStaff
