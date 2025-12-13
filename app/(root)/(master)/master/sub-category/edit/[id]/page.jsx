'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_CATEGORY_SHOW, MASTER_DASHBOARD, MASTER_SUB_CATEGORY_SHOW } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SUB_CATEGORY_SHOW, label: 'Sub Categories' },
    { href: '', label: 'Edit Sub Category' },
]

const EditSubCategory = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const { id } = use(params)
    const { data: subCategoryData } = useFetch(`/api/master/sub-category/get/${id}`)

    useEffect(() => {
        if (subCategoryData && subCategoryData.success) {

            const data = subCategoryData.data
            form.reset({
                _id: data?._id,
                subCategory: data?.subCategory,
                slug: data?.slug
            })
        }
    }, [subCategoryData])


    const formSchema = zSchema.pick({
        _id: true,
        subCategory: true,
        slug: true,

    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            subCategory: '',
            slug: ''
        }
    })

    useEffect(() => {
        const name = form.getValues('subCategory')
        if (name) {
            form.setValue('slug', slugify(name).toLowerCase())
        }
    }, [form.watch('subCategory')])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put('/api/master/sub-category/update', values)
            if (!response.success) {
                throw new Error(response.message)
            }
            showToast('success', response.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='text-xl font-semibold'>Edit Sub Category</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="subCategory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sub Category</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter Sub Category' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                >
                                </FormField>
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
                                        </FormItem>
                                    )}
                                >
                                </FormField>
                            </div>

                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text='Update Sub Category' className='' />
                            </div>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditSubCategory
