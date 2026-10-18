'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_SHOP_CATEGORY_SHOW, MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { useParams } from 'next/navigation'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SHOP_CATEGORY_SHOW, label: 'Shop Categories' },
    { href: '', label: 'Edit Shop Category' },
]

const EditShopCategory = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const formSchema = zSchema.pick({ category: true, slug: true })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { category: '', slug: '' }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: res } = await axios.get(`/api/master/shop-category/${id}`)
                if (res.success) {
                    form.reset({ category: res.data.category, slug: res.data.slug })
                } else {
                    showToast('error', res.message)
                }
            } catch (error) {
                showToast('error', error?.response?.data?.message || error.message)
            } finally {
                setFetching(false)
            }
        }
        if (id) fetchData()
    }, [id])

    useEffect(() => {
        const name = form.getValues('category')
        if (name) {
            form.setValue('slug', slugify(name).toLowerCase())
        }
    }, [form.watch('category')])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: res } = await axios.put(`/api/master/shop-category/${id}`, values)
            if (!res.success) throw new Error(res.message)
            showToast('success', res.message)
        } catch (error) {
            showToast('error', error?.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='text-xl font-semibold'>Edit Shop Category</h4>
                </CardHeader>

                <CardContent>
                    {fetching ? (
                        <p className='text-sm text-muted-foreground py-4'>Loading...</p>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shop Category</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter Title' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='my-4'>
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter Slug' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <ButtonLoading loading={loading} type='submit' text='Update Shop Category' className='' />
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default EditShopCategory
