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
import { PROVIDER_DASHBOARD, PROVIDER_PROFILE } from '@/routes/ProviderPanelRoute'


const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: PROVIDER_PROFILE, label: 'Profile' },
]

const ProviderProfile = () => {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState()
    const [file, setFile] = useState()
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const dispatch = useDispatch()

    const { data: user } = useFetch('/api/website/profile/get')

    useEffect(() => {
        if (user && user.success) {
            const userData = user.data
            form.reset({
                name: userData?.name,
                phone: userData?.phone,
            })

            setPreview(userData?.avatar?.url)
        }
    }, [user])


    const formSchema = zSchema.pick({
        name: true,
        phone: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
        }
    })

    const passwordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: zSchema.shape.password,
        confirmPassword: zSchema.shape.password,
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
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

            const { data: response } = await axios.put('/api/website/profile/update', formData)
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
    const updatePassword = async (values) => {
        setPasswordLoading(true)
        try {
            const { data: response } = await axios.post('/api/website/profile/change-password', values)
            if (!response.success) {
                throw new Error(response.message)
            }
            showToast('success', response.message)
            passwordForm.reset()
            setShowPasswordForm(false)
        } catch (error) {
            showToast('error', error?.response?.data?.message || error.message)
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setPreview(preview)
        setFile(file)
    }

    return (
        <div>
            <div className=''>
                <BreadCrumb breadCrumbData={breadCrumbData} />
            </div>
            <div className='shadow rounded'>
                <div className='p-5 text-xl font-semibold border'>
                    Provider Profile
                </div>

                <div className='md:col-span-2 col-span-1 flex justify-center items-center'>
                    <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className='w-28 h-28 relative group border border-pink-100 mt-3'>
                                    <AvatarImage
                                        src={preview ? preview : userIcon.src}
                                    />
                                    <div className='absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center border-2 border-pink-500 rounded-full group-hover:flex hidden cursor-pointer bg-black/50 text-pink-500'>
                                        <Camera />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <div className='p-5 py-2 mb-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateProfile)} className='md:grid-cols-1 gap-5 grid-cols-1 '>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input name='name' placeholder='Write your name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>



                            <div className='mb-3 md:col-span-2 col-span-1'>
                                <FormField
                                    control={form.control}
                                    name='phone'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input name='number' placeholder='03000000000' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3 md:col-span-2 col-span-1'>
                                <ButtonLoading type='submit' loading={loading} text='Update profile' className='cursor-pointer text-center' />
                            </div>
                        </form>

                    </Form>

                    <div className='mt-10 border-t pt-5'>
                        <div className='flex justify-between items-center mb-5'>
                            <h3 className='text-lg font-semibold'>Security</h3>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className='text-pink-500 hover:text-pink-600 font-medium text-sm'
                            >
                                {showPasswordForm ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(updatePassword)} className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={passwordForm.control}
                                            name='currentPassword'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' placeholder='********' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='hidden md:block'></div>
                                        <FormField
                                            control={passwordForm.control}
                                            name='newPassword'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' placeholder='********' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name='confirmPassword'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' placeholder='********' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='flex justify-end'>
                                        <ButtonLoading
                                            type='submit'
                                            loading={passwordLoading}
                                            text='Update Password'
                                            className='cursor-pointer'
                                        />
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProviderProfile
