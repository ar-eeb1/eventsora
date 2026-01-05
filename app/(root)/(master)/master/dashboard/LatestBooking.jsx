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

const LatestBooking = () => {
    return (
        <div>
            <Table >
                <TableHeader className=''>
                    <TableRow>
                        <TableHead>Booking Id</TableHead>
                        <TableHead>Booked Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">INV{i+1}</TableCell>
                            <TableCell>banquet</TableCell>
                            <TableCell>Pending</TableCell>
                            <TableCell className="text-right">{i*250}.00</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestBooking
