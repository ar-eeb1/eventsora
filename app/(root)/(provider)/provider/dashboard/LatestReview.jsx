'use client'
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
import img from '@/public/assets/img-placeholder.png'
import { Star } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import Link from 'next/link'
import { WEBSITE_LISTING, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'

const LatestReview = () => {
    const { data: latestReviewsResponse, loading } = useFetch(
        '/api/provider/dashboard/latest-reviews'
    )
    console.log(latestReviewsResponse);
    
    const reviews = latestReviewsResponse?.data || []

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className='flex justify-between items-center pt-5 h-10'>
                        <TableHead>Listing</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=''>
                    {reviews.length > 0 ? (
                        reviews.map((r) => (
                            <TableRow key={r._id} className='flex justify-between '>
                                <TableCell className="font-medium flex items-center gap-2 ">
                                    <Avatar>
                                        <AvatarImage src={img.src} />
                                    </Avatar>
                                    <Link href={WEBSITE_LISTING_DETAILS(r.slug)} className='line-clamp-1'>
                                        {r.listing || 'Unknown'}
                                    </Link>
                                </TableCell>
                                <TableCell className="capitalize">{r.reviewer || 'Guest'}</TableCell>
                                <TableCell className='flex items-center text-yellow-500'>
                                    <div className='flex '>
                                        {Array.from({ length: r.rating || 0 }).map((_, i) => (
                                            <span key={i} className='flex'>
                                                <Star className='text-yellow-500' size={13} />
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className='text-center py-4 text-muted-foreground'>
                                {loading ? 'Loading...' : 'No reviews found'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestReview
