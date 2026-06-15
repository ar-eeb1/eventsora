'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

const InvoicePage = () => {
    const { booking_id } = useParams()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const id = Array.isArray(booking_id) ? booking_id[0] : booking_id
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/booking-details/${id}`)
                if (data.success) {
                    setBooking(data.data)
                }
            } catch (error) {
                console.error(error)
                showToast('error', 'Failed to fetch invoice details')
            } finally {
                setLoading(false)
            }
        }
        if (booking_id) fetchBooking()
    }, [booking_id])

    if (loading) return <div className="p-10 text-center">Loading Invoice...</div>
    if (!booking) return <div className="p-10 text-center text-red-500">Invoice not found.</div>

    const totalReceived = booking.receivedAmount || 0
    const balance = booking.totalAmount - totalReceived

    return (
        <div className="min-h-screen bg-gray-50 py-10 print:py-0 print:bg-white">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-md print:shadow-none print:max-w-none">
                
                {/* Print Header - Hidden on Print */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <h1 className="text-2xl font-bold text-gray-800">Booking Invoice</h1>
                    <Button onClick={() => window.print()} className="gap-2">
                        <Printer size={18} /> Print Invoice
                    </Button>
                </div>

                {/* Company Header */}
                <div className="flex justify-between border-b pb-8 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-pink-600">{booking?.listings[0]?.name}</h2>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p className="font-bold text-gray-800">Invoice #</p>
                        <p>{booking.booking_id || booking._id}</p>
                        <p className="font-bold text-gray-800 mt-2">Date</p>
                        <p>{new Date().toLocaleDateString('en-PK')}</p>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                        <p className="font-bold text-lg text-gray-800">{booking.name}</p>
                        <p className="text-gray-600 text-sm">{booking.email}</p>
                        <p className="text-gray-600 text-sm">{booking.phone}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Details</h3>
                        <p className="text-gray-800"><span className="font-semibold">Type:</span> {booking.eventType || 'N/A'}</p>
                        <p className="text-gray-800"><span className="font-semibold">Slot:</span> {booking.timeSlot || 'N/A'}</p>
                        <p className="text-gray-800"><span className="font-semibold">Guests:</span> {booking.guestCount || 'N/A'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-10 border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase">
                            <th className="p-3">Listing / Item</th>
                            <th className="p-3">Dates</th>
                            <th className="p-3 text-right">Price</th>
                            <th className="p-3 text-right">Qty</th>
                            <th className="p-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {booking.listings?.map((item, i) => (
                            <tr key={i} className="border-b">
                                <td className="p-3 font-medium">
                                    {item.name}
                                    {item.variantTitle && <span className="block text-xs text-gray-500">{item.variantTitle}</span>}
                                </td>
                                <td className="p-3 text-xs">{item.bookingDate?.join(', ')}</td>
                                <td className="p-3 text-right">{item.price?.toLocaleString()}</td>
                                <td className="p-3 text-right">{item.quantity}</td>
                                <td className="p-3 text-right font-semibold">{(item.price * item.quantity)?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-72 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Total Charges</span>
                            <span className="font-medium">{booking.totalAmount?.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-700 font-semibold border-t pt-2">
                            <span>Amount Received</span>
                            <span>{totalReceived?.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 text-gray-900">
                            <span>Remaining Balance</span>
                            <span className={balance <= 0 ? 'text-green-600' : 'text-pink-600'}>
                                {balance <= 0 ? 'Fully Paid' : `${balance?.toLocaleString()} PKR`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 border-t pt-8 text-center text-xs text-gray-400">
                    <p>Thank you for choosing Eventsora! This is a computer-generated invoice.</p>
                </div>

            </div>
        </div>
    )
}

export default InvoicePage
