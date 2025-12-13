'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import {  MASTER_DASHBOARD, MASTER_LOCALITY_SHOW } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_LOCALITY_SHOW, label: 'Localities' },
    { href: '', label: 'Edit Locality' },
]

const EditCity = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const { id } = use(params)
    const { data: localityData } = useFetch(`/api/master/location/locality/get/${id}`)

    useEffect(() => {
        if (localityData && localityData.success) {

            const data = localityData.data
            form.reset({
                _id: data?._id,
                locality: data?.locality,
            })
        }
    }, [localityData])


    const formSchema = zSchema.pick({
        _id: true,
        locality: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            locality: '',
        }
    })

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put('/api/master/location/locality/update', values)
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
                    <h4 className='text-xl font-semibold'>Edit Locality</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="locality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Locality</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter Locality' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                >
                                </FormField>
                            </div>


                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text='Update Locality' className='' />
                            </div>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCity
