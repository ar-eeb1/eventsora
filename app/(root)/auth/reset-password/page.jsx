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
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OtpVerification from '@/components/application/OtpVerification'
import UpdatePassword from '@/components/application/UpdatePassword'


const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const formSchema = zSchema.pick({
        email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })
    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values)
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }

            setOtpEmail(values.email)
            showToast('success', sendOtpResponse.message)

        } catch (error) {
            showToast('error', error.message)

        } finally {
            setEmailVerificationLoading(false)
        }
    }


    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values)

            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            showToast("success", otpResponse.message)
            setIsOtpVerified(true)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setOtpVerificationLoading(false)
        }
    }

    return (
        <Card className='border-none shadow-xl md:w-[450px] w-[350px]'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-64'></Image>
                </div>
                {!otpEmail ?
                    <div>
                        <div className='text-center relative -top-5'>
                            <h1 className='text-2xl font-semibold '>Reset Password</h1>
                            <h1 className='text-md  '>Enter your email to reset your password</h1>
                        </div>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
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
                                        <ButtonLoading type='submit' text='SEND OTP' className='w-full' loading={emailVerificationLoading} />
                                    </div>
                                    <hr />
                                    <div className='text-center mt-5'>
                                        <Link href={WEBSITE_LOGIN} className='bg-pink-400 rounded-full text-white px-5 py-1 text-sm'>
                                            <span >Back to Login</span>
                                        </Link>
                                    </div>

                                </form>
                            </Form>
                        </div>
                    </div>
                    :
                    <>
                        {!isOtpVerified ?
                            <OtpVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
                            :
                            <UpdatePassword email={otpEmail} />
                        }
                    </>
                }

            </CardContent>
        </Card>
    )
}

export default ResetPassword
