'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Select from '@/components/application/Main/Select'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: '', label: 'Edit User Role' },
]

const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Provider', value: 'provider' },
    { label: 'Admin', value: 'admin' },
    { label: 'Master', value: 'master' },
    { label: 'Suspended', value: 'suspended' },
]

const EditUser = ({ params }) => {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)

    const { data: userData } = useFetch(`/api/master/users/get/${id}`)

    const formSchema = zSchema.pick({
        _id: true,
        role: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            role: '',
        },
    })

    useEffect(() => {
        if (userData?.success) {
            const user = userData.data
            form.reset({
                _id: user._id,
                role: user.role,
            })
        }
    }, [userData])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data } = await axios.put('/api/master/users/update', values)
            if (!data.success) throw new Error(data.message)
            showToast('success', 'User role updated successfully')
        } catch (err) {
            showToast('error', err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className="rounded shadow-sm">
                <CardHeader className="border-b [.border-b]:pb-1">
                    <h4 className="text-xl font-semibold">Edit User Role</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <FormLabel className='mb-2'>Email</FormLabel>
                                <Input
                                    value={userData?.data?.email || ''}
                                    disabled
                                />
                            </div>

                            {/* Phone (Read Only) */}
                            <div className="mb-4">
                                <FormLabel className='mb-2'>Phone</FormLabel>
                                <Input
                                    value={userData?.data?.phone || ''}
                                    disabled
                                />
                            </div>

                            {/* Role */}
                            <div className="mb-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Role</FormLabel>
                                            <FormControl>
                                                <Select
                                                    options={roleOptions}
                                                    selected={field.value}
                                                    setSelected={(val) => field.onChange(val)}
                                                    placeholder="Select role"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <ButtonLoading loading={loading} type="submit" text="Update Role" />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditUser
