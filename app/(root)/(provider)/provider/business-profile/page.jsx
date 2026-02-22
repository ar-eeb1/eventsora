'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { zSchema } from '@/lib/zodSchema'
import { z } from 'zod'
import { USER_DASHBOARD, WEBSITE } from '@/routes/WebsiteRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useForm } from 'react-hook-form'
import userIcon from '@/public/assets/user.png'
import { showToast } from '@/lib/showToast'
import { Camera } from 'lucide-react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { PROVIDER_BUSINESS_PROFILE, PROVIDER_DASHBOARD, PROVIDER_PROFILE } from '@/routes/ProviderPanelRoute'
import { banks as bankData } from '@/lib/utils'
import Select from '@/components/application/Main/Select'

const banks = bankData.map(bank => ({ label: bank, value: bank }))


const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: PROVIDER_BUSINESS_PROFILE, label: 'Business Profile' },
]

const ProviderBusinessProfile = () => {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState()
    const [file, setFile] = useState()

    const dispatch = useDispatch()

    const { data: user } = useFetch('/api/provider/profile/get')

    useEffect(() => {
        if (user && user.success) {
            const userData = user.data
            form.reset({
                name: userData?.name,
                phone: userData?.phone,
                bankName: userData?.bankName,
                accountHolderName: userData?.accountHolderName,
                accountNumber: userData?.accountNumber,
                iban: userData?.iban,
            })

            setPreview(userData?.avatar?.url)
        }
    }, [user])


    const formSchema = zSchema.pick({
        name: true,
        phone: true,
    }).extend({
        bankName: z.string().min(1, "Bank name is required"),
        accountHolderName: z.string().min(1, "Account holder name is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        iban: z.string().min(1, "IBAN is required"),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            bankName: '',
            accountHolderName: '',
            accountNumber: '',
            iban: '',
        }
    })


    const updateProfile = async (values) => {
        setLoading(true)
        try {
            let formData = new FormData()

            if (file) {
                formData.set('file', file)
            }
            formData.set('name', values.name)
            formData.set('phone', values.phone)
            formData.set('bankName', values.bankName)
            formData.set('accountHolderName', values.accountHolderName)
            formData.set('accountNumber', values.accountNumber)
            formData.set('iban', values.iban)

            const { data: response } = await axios.put('/api/provider/profile/update', formData)
            if (!response.success) {
                throw new Error(response.message)
            }
            showToast('success', response.message)
            dispatch(login(response.data))

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div>
            <div className=''>
                <BreadCrumb breadCrumbData={breadCrumbData} />
            </div>
            <div className='shadow rounded'>
                <div className="p-5 text-xl font-semibold">
                    Business Profile{" "}
                    <span className="text-red-500 text-xs">
                        (Please carefully fill out all fields. In case of errors, EVENTSORA® will not be responsible.)
                    </span>
                    <br />
                    <span className="text-sm font-normal">
                        In case of any issues, please contact us.
                    </span>
                </div>

                <div className='p-5 py-2 mb-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateProfile)} >
                            <div className='md:grid-cols-2 grid grid-cols-1 gap-5 mt-2'>
                                <div className='mb-3'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Business Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Write your name' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3 '>
                                    <FormField
                                        control={form.control}
                                        name='phone'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='03000000000' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3 '>
                                    <FormField
                                        control={form.control}
                                        name='bankName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Name </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        options={banks}
                                                        selected={field.value}
                                                        setSelected={field.onChange}
                                                        isMulti={false}
                                                        placeholder='Select Your Bank'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3 '>
                                    <FormField
                                        control={form.control}
                                        name='accountHolderName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Holder Name </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Areeb Amir' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3 '>
                                    <FormField
                                        control={form.control}
                                        name='accountNumber'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Account Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='0000000' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3 '>
                                    <FormField
                                        control={form.control}
                                        name='iban'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>IBAN</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='PK**************' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className='mb-3 md:col-span-2 col-span-1'>
                                    <ButtonLoading type='submit' loading={loading} text='Update Business Profile' className='cursor-pointer text-center' />
                                </div>
                            </div>
                        </form>

                    </Form>


                </div>

            </div>
        </div>
    )
}

export default ProviderBusinessProfile
