import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from './ButtonLoading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const OtpVerification = ({ email, onSubmit, loading }) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    const formSchema = zSchema.pick({
        otp: true, email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: '',
            email: email
        }
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const { data: resendOTPresponse } = await axios.post('/api/auth/resend-otp', { email })

            if (!resendOTPresponse.success) {
                throw new Error(resendOTPresponse.message)
            }

            showToast("success", resendOTPresponse.message)
            setResendCooldown(60)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setIsResendingOtp(false)
        }
    }

    // Timer countdown effect
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldown])

    return (
        <div className=''>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold mb-2'>Complete verification</h1>
                        <p className=''>OTP sent to registered Email</p>
                    </div>
                    <div className='my-5 flex items-center justify-center'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className="text-xl size-10" index={0} />
                                                <InputOTPSlot className="text-xl size-10" index={1} />
                                                <InputOTPSlot className="text-xl size-10" index={2} />
                                                <InputOTPSlot className="text-xl size-10" index={3} />
                                                <InputOTPSlot className="text-xl size-10" index={4} />
                                                <InputOTPSlot className="text-xl size-10" index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mb-5'>
                        <ButtonLoading type='submit' text='VERIFY' className='w-full' loading={loading} />
                        <div className='text-center mt-5'>
                            <button
                                onClick={resendOTP}
                                type='button'
                                disabled={isResendingOtp || resendCooldown > 0}
                                className={`cursor-pointer hover:underline underline-offset-2 text-blue-400 ${isResendingOtp || resendCooldown > 0 ? 'disabled:text-gray-500 cursor-not-allowed' : ''}`}
                            >
                                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OtpVerification
