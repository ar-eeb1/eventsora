'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import {  MASTER_DASHBOARD, MASTER_SUBLOCALITY_SHOW } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SUBLOCALITY_SHOW, label: 'Sublocalities' },
    { href: '', label: 'Edit Sublocality' },
]

const EditCity = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const { id } = use(params)
    const { data: subLocalityData } = useFetch(`/api/master/location/sublocality/get/${id}`)

    useEffect(() => {
        if (subLocalityData && subLocalityData.success) {

            const data = subLocalityData.data
            form.reset({
                _id: data?._id,
                sublocality: data?.sublocality,
            })
        }
    }, [subLocalityData])


    const formSchema = zSchema.pick({
        _id: true,
        sublocality: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            sublocality: '',
        }
    })

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put('/api/master/location/sublocality/update', values)
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
                    <h4 className='text-xl font-semibold'>Edit Sublocality</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="sublocality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sublocality</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter Sublocality' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                >
                                </FormField>
                            </div>


                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text='Update Sublocality' className='' />
                            </div>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCity
