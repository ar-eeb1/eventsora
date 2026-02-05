import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from 'react'
import { Star } from 'lucide-react'
import img from '@/public/assets/profile.png'

const LatestReview = () => {
    return (
        <div>
            <Table >
                <TableHeader className=''>
                    <TableRow className='flex justify-between items-center pt-5 h-10'>
                        <TableHead>Listing</TableHead>
                        <TableHead>Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i} className='flex justify-between '>
                            <TableCell className="font-medium flex items-center gap-2 ">
                                <Avatar>
                                    <AvatarImage src={img.src} />
                                </Avatar>
                                <span className='line-clamp-1'>Haram banquet</span>
                            </TableCell>
                            <TableCell className='flex items-center text-yellow-500'>
                                <div className='flex '>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className='flex'>
                                            <Star className='text-yellow-500' />
                                        </span>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestReview
