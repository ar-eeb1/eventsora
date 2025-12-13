'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/eventsora.png'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/application/ButtonLoading'
import z from 'zod'
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import Link from 'next/link'
import { WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OtpVerification from '@/components/application/OtpVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
import { PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'



const LoginPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState()
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)

    const formSchema = zSchema.pick({
        email: true
    }).extend({
        password: z.string().min('3', 'Password is required')
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const handleLoginSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post('/api/auth/login', values)

            if (!loginResponse.success) {
                throw new Error(loginResponse.message)
            }
            setOtpEmail(values.email)
            form.reset()
            showToast("success", loginResponse.message)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)

            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            setOtpEmail('')
            showToast("success", otpResponse.message)
            dispatch(login(otpResponse.data))

            if (searchParams.has('callback')) {
                router.push(searchParams.get('callback'))
            } else {
                const roleRoutes = {
                    user: USER_DASHBOARD,
                    provider: PROVIDER_DASHBOARD,
                    admin: '',
                    master: '',
                    suspended: ''
                }
                const userRole = otpResponse.data.role;
                router.push(roleRoutes[userRole] || "/");
            }

        } catch (error) {
            showToast("error", error.message)
        } finally {
            setOtpVerificationLoading(false)
        }
    }
    return (
        <div className='relative'>
            <Card className='border-none shadow-xl md:w-[450px] w-[350px]'>
                <CardContent>
                    <div className='flex justify-center'>
                        <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-64'></Image>
                    </div>
                    {!otpEmail ?
                        <div>
                            <div className='text-center relative -top-5'>
                                <h1 className='text-2xl font-semibold mb-5'>Login Into Account</h1>
                            </div>
                            <div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                                        <div className='mb-5'>
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type='email' placeholder="example@email.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='mb-5'>
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className='relative'>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input type={isTypePassword ? 'password' : 'text'} placeholder="**********" {...field} />
                                                        </FormControl>
                                                        <button type='button' className='absolute top-1/2 right-2 p-1 cursor-pointer' onClick={() => setIsTypePassword(!isTypePassword)}>
                                                            {isTypePassword ?
                                                                <IoEyeOffOutline />
                                                                :
                                                                <IoEyeOutline />
                                                            }
                                                        </button>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='mb-5'>
                                            <ButtonLoading type='submit' text='LOGIN' className='w-full' loading={loading} />
                                        </div>
                                        <hr />
                                        <div className='text-center mt-5'>
                                            <Link href={WEBSITE_REGISTER} className='bg-pink-400 rounded-full text-white px-5 py-1 text-sm'>
                                                <span >Create account</span>
                                            </Link>
                                        </div>
                                        <div className='text-center mt-3 text-sm'>
                                            <Link href={WEBSITE_RESETPASSWORD} className='text-primary underline'>Forget Password</Link>
                                        </div>

                                    </form>
                                </Form>
                            </div>
                        </div>
                        :
                        <OtpVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
                    }

                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage
