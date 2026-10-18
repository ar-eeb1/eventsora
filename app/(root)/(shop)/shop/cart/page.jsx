'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import placeholder from '@/public/assets/img-placeholder.png'
import { removeFromProductCart, updateProductCartQuantity } from '@/store/reducer/bookingReducer'
import { SHOP, SHOP_CHECKOUT, SHOP_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const formatPrice = (amount) => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
}).format(amount || 0)

const ProductCartPage = () => {
  const dispatch = useDispatch()
  const items = useSelector((store) => store.bookingStore.productCart || [])
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const total = items.reduce((amount, item) => amount + item.unitPrice * item.quantity, 0)

  const changeQuantity = (item, quantity) => {
    dispatch(updateProductCartQuantity({
      productId: item.productId,
      variantId: item.variantId,
      quantity,
    }))
  }

  const removeItem = (item) => {
    dispatch(removeFromProductCart({ productId: item.productId, variantId: item.variantId }))
  }

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
        <Link href={SHOP} className='hover:text-pink-900'>Shop</Link><span className='px-2'>/</span><span className='text-gray-900'>Cart</span>
      </nav>
      <h1 className='mb-8 text-3xl font-semibold text-gray-900'>Your cart <span className='text-lg font-normal text-gray-500'>({itemCount})</span></h1>

      {!items.length ? (
        <div className='border-t border-gray-200 py-16 text-center'>
          <p className='text-gray-600'>Your cart is empty.</p>
          <Button asChild className='mt-5 bg-pink-900 text-white hover:bg-pink-800'><Link href={SHOP}>Continue shopping</Link></Button>
        </div>
      ) : (
        <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
          <div className='divide-y divide-gray-200 border-y border-gray-200'>
            {items.map((item) => (
              <article key={`${item.productId}-${item.variantId || 'standard'}`} className='flex flex-wrap gap-4 py-5 sm:flex-nowrap'>
                <Link href={SHOP_PRODUCT_DETAILS(item.categorySlug, item.productSlug)} className='relative h-24 w-24 shrink-0 overflow-hidden bg-gray-100'>
                  <Image src={item.image || placeholder} fill alt={item.productName} sizes='96px' className='object-cover' unoptimized={Boolean(item.image)} />
                </Link>
                <div className='min-w-0 flex-1'>
                  <Link href={SHOP_PRODUCT_DETAILS(item.categorySlug, item.productSlug)} className='font-semibold text-gray-900 hover:text-pink-900'>{item.productName}</Link>
                  {item.variantName && <p className='mt-1 text-sm text-gray-600'>{item.variantName}</p>}
                  <p className='mt-1 text-sm text-gray-600'>SKU: {item.sku}</p>
                  <p className='mt-2 text-sm font-semibold text-gray-900'>{formatPrice(item.unitPrice)}</p>
                </div>
                <div className='flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end'>
                  <div className='flex h-9 items-center border border-gray-300'>
                    <button type='button' aria-label={`Decrease ${item.productName} quantity`} disabled={item.quantity <= item.minimumQuantity} onClick={() => changeQuantity(item, item.quantity - 1)} className='flex h-full w-9 items-center justify-center disabled:text-gray-300'><Minus size={15} /></button>
                    <span className='min-w-10 text-center text-sm'>{item.quantity}</span>
                    <button type='button' aria-label={`Increase ${item.productName} quantity`} disabled={item.maxQuantity != null && item.quantity >= item.maxQuantity} onClick={() => changeQuantity(item, item.quantity + 1)} className='flex h-full w-9 items-center justify-center disabled:text-gray-300'><Plus size={15} /></button>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='font-semibold text-gray-900'>{formatPrice(item.unitPrice * item.quantity)}</span>
                    <button type='button' onClick={() => removeItem(item)} aria-label={`Remove ${item.productName}`} className='p-2 text-gray-500 hover:text-red-700'><Trash2 size={17} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className='h-fit border border-gray-200 p-5'>
            <h2 className='text-lg font-semibold text-gray-900'>Order summary</h2>
            <div className='mt-5 flex justify-between border-t border-gray-200 pt-4 text-sm'>
              <span>Subtotal</span><span className='font-semibold'>{formatPrice(total)}</span>
            </div>
            <p className='mt-3 text-xs leading-5 text-gray-500'>Shipping and final availability will be confirmed by the seller.</p>
            <Button asChild className='mt-5 w-full bg-pink-900 text-white hover:bg-pink-800'><Link href={SHOP_CHECKOUT}>Proceed to checkout</Link></Button>
            <Button asChild variant='outline' className='mt-3 w-full'><Link href={SHOP}>Continue shopping</Link></Button>
          </aside>
        </div>
      )}
    </main>
  )
}

export default ProductCartPage