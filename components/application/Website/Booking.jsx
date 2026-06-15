'use client'
import { Calendar, Trash, ShoppingCart, AlertCircle, Package } from 'lucide-react'
import React, { useState, useMemo } from 'react'
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from 'react-redux'
import imgPlaceholder from '@/public/assets/img-placeholder.png'
import Image from 'next/image'
import Link from 'next/link'
import { WEBSITE_BOOKINGS, WEBSITE_CHECKOUT, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { removeFromBooking } from '@/store/reducer/bookingReducer'

// Constants
const IMAGE_SIZE = 100
const CURRENCY = 'PKR'
const LOCALE = 'en-PK'

const Booking = () => {
    const booking = useSelector(store => store.bookingStore)
    const dispatch = useDispatch()

    const [itemToRemove, setItemToRemove] = useState(null)
    const [isRemoving, setIsRemoving] = useState(false)

    // Calculate total price (use variant/listing price, quantity only for variable pricing)
    const isVariablePricing = (pt) => pt === 'per_person' || pt === 'per_hour' || pt === 'per_day'
    const totalPrice = useMemo(() => {
        return booking.listings?.reduce((sum, listing) => {
            const unitPrice = listing.price ?? listing.variantPrice ?? listing.startingPrice ?? 0
            const quantity = isVariablePricing(listing.pricingType) ? (listing.quantity || 1) : 1
            return sum + (unitPrice * quantity)
        }, 0) || 0
    }, [booking.listings])

    // Format currency
    const formatCurrency = (amount) => {
        return amount.toLocaleString(LOCALE, {
            style: 'currency',
            currency: CURRENCY
        })
    }

    // Format date range
    const formatDateRange = (dates) => {
        if (!dates || dates.length === 0) return 'No dates selected'
        if (dates.length === 1) return dates[0]
        return `${dates[0]} - ${dates[dates.length - 1]}`
    }

    // Handle remove item
    const handleRemoveClick = (listing) => {
        setItemToRemove({
            listingId: listing.listingId,
            variantId: listing.variantId,
            bookingDate: listing.bookingDate
        })
    }

    const confirmRemove = () => {
        if (itemToRemove) {
            setIsRemoving(true)
            dispatch(removeFromBooking(itemToRemove))

            // Simulate async operation with feedback
            setTimeout(() => {
                setIsRemoving(false)
                setItemToRemove(null)
            }, 300)
        }
    }

    const cancelRemove = () => {
        setItemToRemove(null)
    }

    return (
        <>
            <Sheet>
                <SheetTrigger className='relative' aria-label="View bookings">
                    <Calendar sx={{ fontSize: { xs: 20, md: 24 } }}className='text-white hover:text-primary transition-colors' />
                    {booking.count > 0 && (
                        <span className='absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold'>
                            {booking.count}
                        </span>
                    )}
                </SheetTrigger>
                <SheetContent className='w-full sm:max-w-lg'>
                    <SheetHeader>
                        <SheetTitle className='text-2xl flex items-center gap-2'>
                            <ShoppingCart size={24} />
                            My Bookings
                        </SheetTitle>
                        <SheetDescription>
                            {booking.count > 0
                                ? `You have ${booking.count} ${booking.count === 1 ? 'item' : 'items'} in your booking cart`
                                : 'Your booking cart is empty'
                            }
                        </SheetDescription>
                    </SheetHeader>

                    <div className='flex flex-col h-[calc(100vh-100px)]'>
                        {/* Bookings List */}
                        <div className='flex-1 overflow-auto py-4 px-1'>
                            {booking.count === 0 ? (
                                <div className='h-full flex flex-col justify-center items-center text-center px-4'>
                                    <Package size={64} className='text-gray-300 mb-4' />
                                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                                        No bookings yet
                                    </h3>
                                    <p className='text-gray-500 text-sm'>
                                        Start exploring and add items to your booking cart
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {booking.listings?.map((listing, index) => (
                                        <div
                                            key={`${listing.listingId}-${listing.variantId}-${index}`}
                                            className='flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow bg-white'
                                        >
                                            {/* Image */}
                                            <Link
                                                href={WEBSITE_LISTING_DETAILS(listing.url)}
                                                target='_blank'
                                                className='shrink-0'
                                                aria-label={`View ${listing.listingName} details`}
                                            >
                                                <div className='relative w-24 h-24 rounded-md overflow-hidden bg-gray-100'>
                                                    <Image
                                                        src={listing?.thumbnail?.secure_url || imgPlaceholder.src}
                                                        fill
                                                        className='object-cover hover:scale-105 transition-transform'
                                                        alt={listing?.listingName || 'Listing image'}
                                                    />
                                                </div>
                                            </Link>

                                            {/* Content */}
                                            <div className='flex-1 min-w-0'>
                                                <Link
                                                    href={WEBSITE_LISTING_DETAILS(listing.url)}
                                                    target='_blank'
                                                    className='block'
                                                >
                                                    <h4 className='text-base font-semibold hover:text-primary line-clamp-2 mb-1'>
                                                        {listing?.listingName}
                                                    </h4>
                                                </Link>

                                                <div className='space-y-1 text-sm text-gray-600'>
                                                    <p className='flex items-center gap-1'>
                                                        <Calendar size={14} />
                                                        <span>{formatDateRange(listing?.bookingDate)}</span>
                                                    </p>

                                                    {listing?.variantTitle && (
                                                        <p className='text-xs bg-gray-100 inline-block px-2 py-1 rounded'>
                                                            {listing.variantTitle}
                                                        </p>
                                                    )}

                                                    {(listing?.price ?? listing?.variantPrice) ? (
                                                        <div className='font-medium text-gray-900'>
                                                            {listing.discount > 0 && (
                                                                <span className='text-xs line-through text-gray-400 mr-1'>
                                                                    {formatCurrency((listing.variantPrice || listing.price) * (listing.quantity || 1))}
                                                                </span>
                                                            )}
                                                            {formatCurrency(listing.price ?? listing.variantPrice ?? 0)} × {listing.quantity || 1} = {' '}
                                                            <span className='text-primary font-semibold'>
                                                                {formatCurrency((listing.price ?? listing.variantPrice ?? 0) * (listing.quantity || 1))}
                                                            </span>
                                                            {listing.discount > 0 && (
                                                                <span className='block text-xs text-green-600'>
                                                                    Discount: {formatCurrency(listing.discount)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : listing?.startingPrice ? (
                                                        <p className='text-sm text-gray-600'>
                                                            Starting from {formatCurrency(listing.startingPrice)}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <div className='shrink-0'>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveClick(listing)}
                                                    disabled={isRemoving}
                                                    className='hover:bg-red-50'
                                                    aria-label={`Remove ${listing.listingName} from bookings`}
                                                >
                                                    <Trash size={18} className='text-red-500 hover:text-red-700' />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer with Total and Actions */}
                        {booking.count > 0 && (
                            <div className='border-t pt-4 pb-2 px-1 bg-white'>
                                <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-gray-600'>Subtotal ({booking.count} {booking.count === 1 ? 'item' : 'items'})</span>
                                        <span className='font-semibold'>{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-lg font-bold'>
                                        <span>Total</span>
                                        <span className='text-primary'>{formatCurrency(totalPrice)}</span>
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <SheetClose asChild>
                                        <Link href={WEBSITE_BOOKINGS} className='flex-1'>
                                            <Button variant="outline" className='w-full cursor-pointer'>
                                                Check Bookings
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href={WEBSITE_CHECKOUT} className='flex-1' >
                                            <Button variant="outline" className='bg-pink-700 text-white hover:text-white hover:bg-primary/90 w-full cursor-pointer' disabled={booking.count === 0}>
                                                Proceed to Checkout
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                </div>

                                <p className='text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1 '>
                                    <AlertCircle size={12} />
                                    Prices and availability will be confirmed at checkout
                                </p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Confirmation Dialog */}
            <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && cancelRemove()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from bookings?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this item from your booking cart? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelRemove}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRemove}
                            className='bg-red-500 hover:bg-red-600'
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Booking