'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import {  MASTER_STATE_SHOW, MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_STATE_SHOW, label: 'State' },
    { href: '', label: 'Edit State' },
]

const EditState = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const { id } = use(params)
    const { data: stateData } = useFetch(`/api/master/location/state/get/${id}`)

    useEffect(() => {
        if (stateData && stateData.success) {
            const data = stateData.data
            form.reset({
                _id: data?._id,
                state: data?.state,
            })
        }
    }, [stateData])


    const formSchema = zSchema.pick({
        _id: true,
        state: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            state: '',
        }
    })

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put('/api/master/location/state/update', values)
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
                    <h4 className='text-xl font-semibold'>Edit State</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter State' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                >
                                </FormField>
                            </div>
                          

                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text='Update State' className='' />
                            </div>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditState
