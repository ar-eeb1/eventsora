'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/application/ButtonLoading'
import placeholder from '@/public/assets/img-placeholder.png'
import { clearProductCart } from '@/store/reducer/bookingReducer'
import { SHOP, SHOP_CART, SHOP_CHECKOUT } from '@/routes/WebsiteRoute'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import { showToast } from '@/lib/showToast'
import { getMinimumDeliverySlot, SHOP_DELIVERY_TIME_ZONE } from '@/lib/shopDelivery'

const formatPrice = (amount) => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
}).format(amount || 0)

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const auth = useSelector((store) => store.authStore.auth)
  const productCart = useSelector((store) => store.bookingStore.productCart || [])
  const [customer, setCustomer] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState([])
  const [deliverySlot, setDeliverySlot] = useState(null)
  const [deliverySlotLoading, setDeliverySlotLoading] = useState(Boolean(productCart.length))
  const [deliverySlotError, setDeliverySlotError] = useState('')
  const [deliveryValidationError, setDeliveryValidationError] = useState('')
  const minimumDelivery = deliverySlot || getMinimumDeliverySlot(productCart)
  const defaults = {
    customerName: auth?.name || '',
    customerEmail: auth?.email || '',
    customerPhone: auth?.phone || '',
    shippingAddress: auth?.address || '',
    deliveryDate: minimumDelivery.date,
    deliveryTime: minimumDelivery.time,
    note: '',
  }
  const values = customer || defaults

  useEffect(() => {
    if (!auth || !productCart.length) {
      setDeliverySlotLoading(false)
      return
    }

    let cancelled = false
    setDeliverySlot(null)
    setDeliverySlotError('')
    setDeliverySlotLoading(true)
    axios.post('/api/website/product-order/delivery-slot', {
      items: productCart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
      })),
    }).then(({ data }) => {
      if (!data.success) throw new Error(data.message || 'Could not check preparation time.')
      if (!cancelled) setDeliverySlot(data.data.minimumDelivery)
    }).catch((error) => {
      if (cancelled) return
      const message = error.response?.data?.message || error.message || 'Could not check preparation time.'
      setDeliverySlotError(message)
      showToast('error', message)
    }).finally(() => {
      if (!cancelled) setDeliverySlotLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [auth, productCart])

  const updateField = (event) => {
    const { name, value } = event.target
    setCustomer((current) => ({ ...(current || defaults), [name]: value }))
    if (name === 'deliveryDate' || name === 'deliveryTime') setDeliveryValidationError('')
  }

  const getDeliveryValidationMessage = () => {
    if (!values.deliveryDate || !values.deliveryTime) return ''

    const selectedSlot = `${values.deliveryDate}T${values.deliveryTime}`
    const earliestSlot = `${minimumDelivery.date}T${minimumDelivery.time}`
    if (selectedSlot >= earliestSlot) return ''

    return `Can't deliver on your selected date. Preparation time requires delivery on ${minimumDelivery.date} at ${minimumDelivery.time} or later (${SHOP_DELIVERY_TIME_ZONE}).`
  }

  const validateDeliverySlot = () => {
    const message = getDeliveryValidationMessage()
    setDeliveryValidationError(message)
    if (message) showToast('error', message)
    return !message
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!auth || !productCart.length) return
    if (!validateDeliverySlot()) return

    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/website/product-order', {
        items: productCart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        ...values,
      })
      if (!data.success) throw new Error(data.message || 'Could not place the order.')
      setConfirmation(data.data.orders || [])
      dispatch(clearProductCart())
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message || 'Could not place the order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation.length > 0) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-16 text-center sm:px-6'>
        <p className='text-sm font-semibold uppercase text-pink-800'>Order received</p>
        <h1 className='mt-3 text-3xl font-semibold text-gray-900'>Thank you for your order</h1>
        <div className='mx-auto mt-6 max-w-lg divide-y border-y border-gray-200 text-left'>
          {confirmation.map((order) => (
            <div key={order._id} className='flex justify-between gap-4 py-3 text-sm'>
              <div>
                <p className='font-semibold text-gray-900'>{order.orderNumber}</p>
                <p className='text-gray-500'>Status: {order.status}</p>
                <p className='text-gray-500'>Requested delivery: {order.deliveryDate} at {order.deliveryTime} {order.deliveryTimeZone}</p>
              </div>
              <p className='font-semibold text-gray-900'>{formatPrice(order.totalAmount)}</p>
            </div>
          ))}
        </div>
        <Button asChild className='mt-8 bg-pink-900 text-white hover:bg-pink-800'>
          <Link href={SHOP}>Continue shopping</Link>
        </Button>
      </main>
    )
  }

  if (!productCart.length) {
    return (
      <main className='mx-auto max-w-2xl px-4 py-16 text-center sm:px-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Your cart is empty</h1>
        <p className='mt-3 text-gray-600'>Add products to your cart before checkout.</p>
        <Button asChild className='mt-6 bg-pink-900 text-white hover:bg-pink-800'><Link href={SHOP}>Browse the shop</Link></Button>
      </main>
    )
  }

  if (!auth) {
    return (
      <main className='mx-auto max-w-2xl px-4 py-16 text-center sm:px-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Sign in to place your order</h1>
        <Button asChild className='mt-6 bg-pink-900 text-white hover:bg-pink-800'>
          <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(SHOP_CHECKOUT)}`}>Login to continue</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='mb-8 text-3xl font-semibold text-gray-900'>Order details</h1>
      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <fieldset disabled={deliverySlotLoading || Boolean(deliverySlotError)} className='space-y-5 border-0 p-0'>
            <h2 className='text-lg font-semibold text-gray-900'>Delivery information</h2>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-1 text-sm font-medium text-gray-700'>
                Full name
                <input name='customerName' required minLength={2} maxLength={100} value={values.customerName} onChange={updateField} className='h-11 w-full rounded-sm border border-gray-300 px-3' />
              </label>
              <label className='space-y-1 text-sm font-medium text-gray-700'>
                Email
                <input name='customerEmail' type='email' required maxLength={254} value={values.customerEmail} onChange={updateField} className='h-11 w-full rounded-sm border border-gray-300 px-3' />
              </label>
              <label className='space-y-1 text-sm font-medium text-gray-700'>
                Phone
                <input name='customerPhone' type='tel' required minLength={6} maxLength={30} value={values.customerPhone} onChange={updateField} className='h-11 w-full rounded-sm border border-gray-300 px-3' />
              </label>
              <label className='space-y-1 text-sm font-medium text-gray-700 sm:col-span-2'>
                Delivery address
                <textarea name='shippingAddress' required minLength={5} maxLength={500} value={values.shippingAddress} onChange={updateField} rows={3} className='w-full rounded-sm border border-gray-300 px-3 py-2' />
              </label>
              <div className='space-y-1 text-sm font-medium text-gray-700'>
                <label htmlFor='deliveryDate'>Preferred delivery date</label>
                <input id='deliveryDate' name='deliveryDate' type='date' required min={minimumDelivery.date} value={values.deliveryDate} onChange={updateField} className='h-11 w-full rounded-sm border border-gray-300 px-3' />
              </div>
              <div className='space-y-1 text-sm font-medium text-gray-700'>
                <label htmlFor='deliveryTime'>Preferred delivery time ({SHOP_DELIVERY_TIME_ZONE})</label>
                <input id='deliveryTime' name='deliveryTime' type='time' required min={values.deliveryDate === minimumDelivery.date ? minimumDelivery.time : undefined} value={values.deliveryTime} onChange={updateField} className='h-11 w-full rounded-sm border border-gray-300 px-3' />
              </div>
              <p className='text-xs text-gray-500 sm:col-span-2'>
                The earliest available delivery is {minimumDelivery.date} at {minimumDelivery.time} ({SHOP_DELIVERY_TIME_ZONE}), based on preparation time for the items in your cart.
              </p>
              <label className='space-y-1 text-sm font-medium text-gray-700 sm:col-span-2'>
                Note for seller (optional)
                <textarea name='note' maxLength={1000} value={values.note} onChange={updateField} rows={3} className='w-full rounded-sm border border-gray-300 px-3 py-2' />
              </label>
            </div>
          </fieldset>
          {deliverySlotLoading && <p className='text-sm text-gray-500'>Checking preparation time for your items...</p>}
          {deliverySlotError && <p role='alert' className='text-sm text-red-700'>{deliverySlotError}</p>}
          {deliveryValidationError && <p role='alert' className='text-sm text-red-700'>{deliveryValidationError}</p>}
          <ButtonLoading type='submit' loading={submitting} onClick={validateDeliverySlot} disabled={deliverySlotLoading || Boolean(deliverySlotError)} text='Place order' className='w-full bg-pink-900 text-white hover:bg-pink-800 sm:w-auto' />
        </form>

        <aside className='h-fit border border-gray-200 p-4'>
          <h2 className='mb-4 text-lg font-semibold text-gray-900'>Your order</h2>
          <div className='divide-y divide-gray-100'>
            {productCart.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'standard'}`} className='flex gap-3 py-3'>
                <div className='relative h-16 w-16 shrink-0 overflow-hidden bg-gray-100'>
                  <Image src={item.image || placeholder} fill alt={item.productName} sizes='64px' className='object-cover' unoptimized={Boolean(item.image)} />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='line-clamp-2 text-sm font-medium text-gray-900'>{item.productName}</p>
                  {item.variantName && <p className='text-xs text-gray-500'>{item.variantName}</p>}
                  <p className='text-xs text-gray-600'>{item.quantity} × {formatPrice(item.unitPrice)}</p>
                </div>
                <p className='shrink-0 text-sm font-semibold'>{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-between border-t border-gray-200 pt-4 text-sm'>
            <span>Subtotal</span>
            <span className='font-semibold'>{formatPrice(productCart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))}</span>
          </div>
          <Button asChild variant='link' className='mt-2 h-auto px-0 text-pink-900'><Link href={SHOP_CART}>Edit cart</Link></Button>
          <p className='mt-2 text-xs text-gray-500'>Eventsora will review your order and payment before sending it to the seller. Payment is not collected on this page.</p>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage