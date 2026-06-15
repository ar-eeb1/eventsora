'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useFetch from '@/hooks/useFetch'

const LatestBooking = () => {
    const { data: latestBookingsResponse, loading } = useFetch('/api/admin/dashboard/latest-bookings')
    const bookings = latestBookingsResponse?.data || []

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking Id</TableHead>
                        <TableHead>Booked Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell className="font-medium">{booking.booking_id}</TableCell>
                                <TableCell className="capitalize">
                                    {booking.listings.map(l => l.name).join(', ')}
                                </TableCell>
                                <TableCell className="capitalize">{booking.bookingStatus}</TableCell>
                                <TableCell className="text-right">
                                    {booking.totalAmount?.toLocaleString()}.00
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                {loading ? 'Loading...' : 'No bookings found'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestBooking
