'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Copy, Landmark, User, Hash, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showToast } from '@/lib/showToast'
import BreadCrumb from '@/components/application/BreadCrumb'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'

const breadCrumbData = [
    { href: WEBSITE_HOME, label: 'Home' },
    { href: '', label: 'Payment Details' },
]

const PaymentDetails = () => {
    const searchParams = useSearchParams()
    const booking_id = searchParams.get('booking_id')
    const amount = searchParams.get('amount')

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
        showToast('success', `${label} copied to clipboard`)
    }

    const bankDetails = [
        { label: 'BANK', value: 'United Bank Limited', icon: <Landmark className="w-5 h-5 text-pink-500" /> },
        { label: 'A/C', value: '337815072', icon: <Hash className="w-5 h-5 text-pink-500" />, copyable: true },
        { label: 'IBAN', value: 'PK19UNIL0109000337815072', icon: <Landmark className="w-5 h-5 text-pink-500" />, copyable: true },
        { label: 'TITLE', value: 'Eventsora Ltd', icon: <User className="w-5 h-5 text-pink-500" /> },
    ]

    return (
        <div className="lg:px-32 px-4 mt-10 mb-20">
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <div className="max-w-3xl mx-auto mt-10">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Placed Successfully!</h1>
                    <p className="text-gray-600 italic">Please complete your payment to confirm your booking.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Booking Info Card */}
                    <Card className="border-pink-100 bg-pink-50/30">
                        <CardHeader>
                            <CardTitle className="text-xl text-pink-700">Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-pink-100">
                                <span className="text-gray-600 font-medium">Booking ID</span>
                                <span className="font-bold text-gray-900">{booking_id}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Total Amount</span>
                                <span className="font-bold text-2xl text-pink-600">
                                    {Number(amount).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Details Card */}
                    <Card className="border-pink-100">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Landmark className="w-6 h-6 text-pink-500" />
                                Bank Information
                            </CardTitle>
                            <CardDescription>Direct Bank Transfer (Manual Payment)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bankDetails.map((detail, index) => (
                                <div key={index} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{detail.label}</span>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            {detail.icon}
                                            <span className="font-semibold text-gray-800 break-all">{detail.value}</span>
                                        </div>
                                        {detail.copyable && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-pink-500"
                                                onClick={() => copyToClipboard(detail.value, detail.label)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8 border-yellow-100 bg-yellow-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <Banknote className="w-6 h-6 text-yellow-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-yellow-900 mb-1">What to do next?</h4>
                                <ul className="text-sm text-yellow-800 space-y-2 list-disc pl-4">
                                    <li>Transfer the total amount to the bank account mentioned above.</li>
                                    <li>Take a screenshot of the successful transaction.</li>
                                    <li>Share the screenshot along with your **Booking ID ({booking_id})** on our WhatsApp or email.</li>
                                    <li>Your booking will be confirmed after payment verification.</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-10 text-center">
                    <Button variant="outline" asChild className="rounded-full px-8">
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const PaymentPage = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        }>
            <PaymentDetails />
        </Suspense>
    )
}

export default PaymentPage
