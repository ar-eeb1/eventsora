'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
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
import z, { email } from 'zod'
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import Link from 'next/link'
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

const RegisterPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const searchParams = useSearchParams()
    const roleParam = searchParams.get('role')
    const isProvider = roleParam === 'provider'

    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true,
        phone: true,
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Password and confirm password must be same',
        path: ['confirmPassword']
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            phone: ''
        }
    })

    const handleRegisterSubmit = async (values) => {
        try {
            setLoading(true)
            const payload = { ...values, role: isProvider ? 'provider' : 'user' }
            const { data: registerResponse } = await axios.post('/api/auth/register', payload)

            if (!registerResponse.success) {
                throw new Error(registerResponse.message)
            }

            form.reset()
            showToast('success', registerResponse.message)
            router.push('/auth/login')
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className=''>
            <Card className='border-none shadow-xl md:w-[450px] w-[350px]'>
                <CardContent>
                    <div className='relative'>
                        <div className='flex justify-center'>
                            <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-64'></Image>
                        </div>
                        <div className='text-center relative -top-5'>
                            <h1 className='text-2xl font-semibold mb-5'>{isProvider ? 'Provider Signup' : 'Create a new account'}</h1>
                        </div>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input type='name' placeholder="Full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type='email' placeholder="username@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile Number</FormLabel>
                                                <FormControl>
                                                    <Input type='number' placeholder="03123456789" {...field} />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className='relative'>
                                                <FormLabel>Confirm Password</FormLabel>
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
                                    <ButtonLoading type='submit' text='SIGN UP' className='w-full' loading={loading} />
                                </div>
                                {/* {!isProvider && (
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
                                <div className='text-center mt-2'>
                                    <Link href={`${WEBSITE_LOGIN}${isProvider ? '?role=provider' : ''}`} className='rounded-full text-sm flex flex-col'>
                                        <span>Already have an account? </span>
                                        <span className='underline underline-offset-3 '>LOGIN</span>
                                    </Link>
                                </div>
                                {/* <div className='text-center mt-3'>
                                    {isProvider ?
                                        <Link href='/auth/register' className='text-sm text-pink-500 hover:underline'>Join as a Customer</Link>
                                        :
                                        <Link href='/auth/register?role=provider' className='text-sm text-pink-500 hover:underline'>Join as a Provider</Link>
                                    }
                                </div> */}
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage
