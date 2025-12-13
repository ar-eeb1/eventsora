'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_CITY_SHOW, MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_CITY_SHOW, label: 'Cities' },
    { href: '', label: 'Edit City' },
]

const EditCity = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const { id } = use(params)
    const { data: cityData } = useFetch(`/api/master/location/city/get/${id}`)

    useEffect(() => {
        if (cityData && cityData.success) {

            const data = cityData.data
            form.reset({
                _id: data?._id,
                city: data?.city,
            })
        }
    }, [cityData])


    const formSchema = zSchema.pick({
        _id: true,
        city: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: id,
            city: '',
        }
    })

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put('/api/master/location/city/update', values)
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
                    <h4 className='text-xl font-semibold'>Edit City</h4>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter City' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                >
                                </FormField>
                            </div>


                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text='Update City' className='' />
                            </div>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCity
