'use client'
import { Calendar } from 'lucide-react'
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useSelector } from 'react-redux'
import imgPlaceholder from '@/public/assets/img-placeholder.png'
import Image from 'next/image'

const Booking = () => {
    const booking = useSelector(store => store.bookingStore)
    console.log(booking);

    return (
        <Sheet>
            <SheetTrigger className='relative'>
                <Calendar size={25} className='text-white hover:text-primary' />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='text-2xl'>My Bookings</SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
                <div className='h-[calc(100vh-40px)] pb-10 pt-2'>
                    <div className='h-[calc(100%-128px)] overflow-auto pe-2'>
                        {booking.count === 0 &&
                            <div className='h-full flex justify-center items-center text-xl font-semibold'>
                                No bookings found
                            </div>
                        }
                        {booking.listings?.map(listing => (
                            <div className='flex justify-between items-center gap-5 mb-4 border-b pb-4'>
                                <div className='flex gap-5 items-center'>
                                    <Image src={listing?.thumbnail?.secure_url || imgPlaceholder.src} width={100} height={100} alt='Image' />
                                </div>
                                <div>
                                    <h4 className='text-lg font-semibold'>{listing?.listingName}</h4>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <div className='h-32 border-t pt-5'>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Booking
