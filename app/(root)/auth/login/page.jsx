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
import { ADMIN_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OtpVerification from '@/components/application/OtpVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
import { PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'
import { MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'

import { signIn } from 'next-auth/react'

const LoginPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState()
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const roleParam = searchParams.get('role')
    const isProvider = roleParam === 'provider'

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
                    admin: ADMIN_DASHBOARD,
                    master: MASTER_DASHBOARD,
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
                                <h1 className='text-2xl font-semibold mb-5'>{isProvider ? 'Provider Login' : 'Login Into Account'}</h1>
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
{/* 
                                        {!isProvider && (
                                            <>
                                                <div className="relative my-4">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <span className="w-full border-t" />
                                                    </div>
                                                    <div className="relative flex justify-center text-xs uppercase">
                                                        <span className="bg-background px-2 text-muted-foreground">
                                                            Or continue with
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='mb-5'>
                                                    <button
                                                        type='button'
                                                        onClick={() => signIn('google')}
                                                        className='w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer'
                                                    >
                                                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google logo" />
                                                        <span>Google</span>
                                                    </button>
                                                </div>
                                            </>
                                        )} */}

                                        <hr />


                                        <div className='text-center mt-5'>
                                            <Link href={`${WEBSITE_REGISTER}${isProvider ? '?role=provider' : ''}`} className='bg-pink-400 rounded-full text-white px-5 py-1 text-sm'>
                                                <span >Create account</span>
                                            </Link>
                                        </div>
                                        <div className='text-center mt-3 text-sm'>
                                            <Link href={WEBSITE_RESETPASSWORD} className='text-primary underline'>Forget Password</Link>
                                        </div>

                                        {/* <div className='text-center mt-3 bg-pink-300 m-0 text-white rounded-full px-5 py-1'>
                                            {isProvider ?
                                                <Link href='/auth/login' className='text-sm hover:underline'>Login as a Customer</Link>
                                                :
                                                <Link href='/auth/login?role=provider' className='text-sm hover:underline'>Login as a Provider</Link>
                                            }
                                        </div> */}
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
