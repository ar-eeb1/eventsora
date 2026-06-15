'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useState, useMemo, useEffect } from 'react'
import { showToast } from '@/lib/showToast'
import { useDispatch, useSelector } from 'react-redux'
import imgPlaceholder from '@/public/assets/img-placeholder.png'
import Image from 'next/image'
import { WEBSITE_CHECKOUT, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { Package, Trash2, Calendar, ShoppingBag } from 'lucide-react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { decreaseQuantity, increaseQuantity, removeFromBooking, updateQuantity } from '@/store/reducer/bookingReducer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

const breadCrumbData = [
  { href: WEBSITE_HOME, label: 'Home' },
  { href: '', label: 'My Bookings' },
]

// Reusable QuantitySelector Component
const QuantitySelector = ({ item, onIncrease, onDecrease, onUpdateQuantity }) => {
  const minQuantity = item.minPersons || 1
  const maxQuantity = item.maxPersons || 999
  const [inputValue, setInputValue] = useState(item.quantity || 1)

  useEffect(() => {
    setInputValue(item.quantity || 1)
  }, [item.quantity])

  const handleBlur = () => {
    let val = parseInt(inputValue, 10)
    if (isNaN(val) || val < minQuantity) {
      showToast('error', `Minimum quantity allowed is ${minQuantity}`)
      val = minQuantity
    } else if (val > maxQuantity) {
      showToast('error', `Maximum quantity allowed is ${maxQuantity}`)
      val = maxQuantity
    }
    setInputValue(val)
    if (val !== item.quantity) {
      onUpdateQuantity(item, val)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur()
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div className='flex items-center h-10 border w-fit rounded-full mt-2 bg-white'>
      <button
        type='button'
        className='h-full w-10 flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-l-full transition-colors'
        disabled={item.quantity <= minQuantity}
        onClick={() => onDecrease(item)}
        aria-label='Decrease quantity'
      >
        <BiMinus size={18} />
      </button>
      <input
        type="number"
        value={inputValue}
        className='w-14 text-center border-none outline-none bg-transparent font-medium'
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label={`Quantity: ${item.quantity}`}
      />
      <button
        type='button'
        className='h-full w-10 flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-r-full transition-colors'
        disabled={item.quantity >= maxQuantity}
        onClick={() => onIncrease(item)}
        aria-label='Increase quantity'
      >
        <BiPlus size={18} />
      </button>
    </div>
  )
}

// Price Display Component
const PriceDisplay = ({ amount, className = '' }) => {
  if (amount === undefined || amount === null) {
    return <span className={className}>Rs. 0</span>
  }
  return (
    <span className={className}>
      {Number(amount).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
    </span>
  )
}

const isVariablePricing = (pricingType) =>
  pricingType === 'per_person' || pricingType === 'per_hour' || pricingType === 'per_day'

// Booking Item Component
const BookingItem = ({ item, onIncrease, onDecrease, onRemove, onUpdateQuantity }) => {
  const unitPrice = item.price ?? item.variantPrice ?? item.startingPrice ?? 0
  const variantPrice = item.variantPrice ?? item.startingPrice ?? 0
  const useQuantity = isVariablePricing(item.pricingType)
  const itemTotal = useQuantity
    ? unitPrice * (item.quantity || 1)
    : unitPrice
  const hasDiscount = item.discount != null && item.discount > 0

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <tr className='md:table-row block border-b hover:bg-gray-50 transition-colors'>
      {/* Listing Info */}
      <td className='md:p-4 p-3'>
        <div className='flex items-start gap-4'>
          <div className='relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border'>
            <Image
              src={item.thumbnail?.secure_url || imgPlaceholder.src}
              alt={item.listingName || 'Listing image'}
              fill
              className='object-cover'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <h4 className='font-semibold line-clamp-2 hover:text-pink-600 transition-colors mb-1'>
              <Link target='_blank' href={WEBSITE_LISTING_DETAILS(item.slug)}>
                {item.listingName}
              </Link>
            </h4>
            {item.bookingDate && (
              <div className='flex items-center gap-1 text-xs text-gray-600 mt-1'>
                <Calendar size={14} />
                <span>{formatDate(item.bookingDate)}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Variant Details */}
      <td className='md:p-4 p-3 md:table-cell'>
        <div className='space-y-2'>
          <div className='flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full w-fit text-xs font-medium uppercase'>
            <Package size={14} />
            {item?.variantTitle || 'Standard'}
          </div>

          {(item.variantTitle || item.pricingType) && (
            <div className='space-y-1 text-sm text-gray-600'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Pricing Type:</span>
                <span className='font-medium text-gray-700'>
                  {item.pricingType?.split('_').join(' ').toUpperCase() || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Unit Price:</span>
                <div className='flex flex-col items-end'>
                  {hasDiscount && (
                    <span className='text-sm line-through text-gray-400'>
                      <PriceDisplay amount={variantPrice} />
                    </span>
                  )}
                  <PriceDisplay amount={unitPrice} className='font-medium text-gray-700' />
                </div>
              </div>
            </div>
          )}

          {isVariablePricing(item.pricingType) && (
            <QuantitySelector
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onUpdateQuantity={onUpdateQuantity}
            />
          )}
        </div>
      </td>

      {/* Starting Price */}
      <td className='md:p-4 p-3 md:table-cell'>
        <div className='md:block flex justify-between items-center'>
          <span className='md:hidden text-sm text-gray-500'>Price:</span>
          <div className='flex flex-col items-end'>
            {hasDiscount && (
              <span className='text-xs line-through text-gray-400'>
                <PriceDisplay amount={variantPrice * (item.quantity || 1)} />
              </span>
            )}
            <PriceDisplay amount={itemTotal} className='font-semibold' />
          </div>
        </div>
      </td>

      {/* Total */}
      <td className='md:p-4 p-3 md:table-cell'>
        <div className='flex justify-between items-center md:flex-col md:items-end gap-2'>
          <span className='md:hidden text-sm text-gray-500'>Total:</span>
          <div className='flex flex-col items-end'>
            {hasDiscount && (
              <span className='text-xs text-green-600 font-medium'>
                Discount: <PriceDisplay amount={item.discount} />
              </span>
            )}
            <PriceDisplay amount={itemTotal} className='font-bold text-lg text-pink-600' />
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className=' md:table-cell'>
        <button
          onClick={() => onRemove(item)}
          className='text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer'
          aria-label='Remove item'
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  )
}

// Empty State Component
const EmptyState = () => (
  <div className='flex justify-center items-center py-20 flex-col gap-5'>
    <div className='w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center'>
      <ShoppingBag size={64} className='text-gray-400' />
    </div>
    <div className='text-center'>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>No bookings found</h1>
      <p className='text-gray-600 mb-6'>Start exploring and add items to your booking list</p>
      <Button size='lg' asChild>
        <Link href={WEBSITE_HOME}>
          Browse Listings
        </Link>
      </Button>
    </div>
  </div>
)

// Summary Card Component
const BookingSummary = ({ listings }) => {
  const summary = useMemo(() => {
    const subtotal = listings.reduce((total, item) => {
      const unitPrice = item.price ?? item.variantPrice ?? item.startingPrice ?? 0
      const qty = isVariablePricing(item.pricingType) ? (item.quantity || 1) : 1
      return total + (unitPrice * qty)
    }, 0)

    const totalDiscount = listings.reduce((sum, item) => sum + (item.discount || 0), 0)
    const originalSubtotal = subtotal + totalDiscount
    const tax = subtotal * 0.0 // Adjust tax rate as needed
    const total = subtotal + tax

    return { subtotal, totalDiscount, originalSubtotal, tax, total, itemCount: listings.length }
  }, [listings])

  return (
    <div className='bg-white border rounded-lg p-6 sticky top-4 shadow-sm'>
      <h2 className='text-xl font-bold mb-4'>Booking Summary</h2>

      <div className='space-y-3 mb-6'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Items ({summary.itemCount})</span>
          <div className='flex flex-col items-end'>
            {summary.totalDiscount > 0 && (
              <span className='text-xs line-through text-gray-400'>
                <PriceDisplay amount={summary.originalSubtotal} />
              </span>
            )}
            <PriceDisplay amount={summary.subtotal} className='font-medium' />
          </div>
        </div>

        {summary.totalDiscount > 0 && (
          <div className='flex justify-between text-sm text-green-600'>
            <span>Discount</span>
            <span className='font-medium'>-<PriceDisplay amount={summary.totalDiscount} /></span>
          </div>
        )}

        {summary.tax > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Tax</span>
            <PriceDisplay amount={summary.tax} className='font-medium' />
          </div>
        )}

        <div className='border-t pt-3'>
          <div className='flex justify-between text-lg font-bold'>
            <span>Total</span>
            <PriceDisplay amount={summary.total} className='text-pink-600' />
          </div>
        </div>
      </div>
      <Link href={WEBSITE_CHECKOUT}>
        <Button
          className='w-full cursor-pointer bg-pink-700 text-white'
          size='lg'
        >
          Proceed to Checkout
        </Button>
      </Link>

      <div className='mt-4 p-3 bg-pink-50 rounded-lg'>
        <p className='text-xs text-pink-800 text-center'>
          Secure booking • Cancel anytime
        </p>
      </div>
    </div>
  )
}

const BookingPage = () => {
  const booking = useSelector((store) => store.bookingStore)
  const dispatch = useDispatch()

  const [itemToRemove, setItemToRemove] = useState(null)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  const handleIncrease = (item) => {
    dispatch(increaseQuantity({
      listingId: item.listingId,
      variantId: item.variantId,
      bookingDate: item.bookingDate
    }))
  }

  const handleDecrease = (item) => {
    dispatch(decreaseQuantity({
      listingId: item.listingId,
      variantId: item.variantId,
      bookingDate: item.bookingDate
    }))
  }

  const handleUpdateQuantity = (item, quantity) => {
    dispatch(updateQuantity({
      listingId: item.listingId,
      variantId: item.variantId,
      bookingDate: item.bookingDate,
      quantity
    }))
  }

  const handleRemoveClick = (item) => {
    setItemToRemove(item)
    setShowRemoveDialog(true)
  }

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromBooking({
        listingId: itemToRemove.listingId,
        variantId: itemToRemove.variantId,
        bookingDate: itemToRemove.bookingDate
      }))
    }
    setShowRemoveDialog(false)
    setItemToRemove(null)
  }


  return (
    <div className='lg:px-20 md:px-10 px-10 my-20'>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {booking.count === 0 ? (
        <EmptyState />
      ) : (
        <div className='py-5'>
          <div className='flex lg:flex-row flex-col gap-6'>
            {/* Booking Items Table */}
            <div className='lg:w-[70%] w-full'>
              <div className='bg-white rounded-lg border overflow-hidden shadow-sm'>
                <div className='p-4 bg-gray-50 border-b'>
                  <h2 className='text-xl font-bold'>Your Bookings ({booking.count})</h2>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 border-b md:table-header-group hidden'>
                      <tr>
                        <th className='text-start p-4 font-semibold text-gray-700'>Listing</th>
                        <th className='text-start p-4 font-semibold text-gray-700'>Variant Details</th>
                        <th className='text-start p-4 font-semibold text-gray-700'>Price</th>
                        <th className='text-end p-4 font-semibold text-gray-700'>Total</th>
                     T   <th className='text-end p-4 font-semibold text-gray-700'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking?.listings?.map((item, index) => (
                        <BookingItem
                          key={`${item.listingId}-${item.variantId}-${index}`}
                          item={item}
                          onIncrease={handleIncrease}
                          onDecrease={handleDecrease}
                          onRemove={handleRemoveClick}
                          onUpdateQuantity={handleUpdateQuantity}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className='lg:w-[30%] w-full'>
              <BookingSummary
                listings={booking.listings}
              />
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from bookings?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.listingName}" from your bookings?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className='bg-red-600 hover:bg-red-700'>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default BookingPage