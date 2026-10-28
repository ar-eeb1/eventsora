'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { Rating } from '@mui/material'
import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import placeholder from '@/public/assets/img-placeholder.png'
import ListingReview from '@/components/application/Website/ListingReview'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import { addToProductCart } from '@/store/reducer/bookingReducer'
import { SHOP, SHOP_CART, SHOP_CATEGORY, SHOP_CHECKOUT, SHOP_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import { messageApi } from '@/lib/messageApi'

const formatPrice = (price) => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
}).format(price || 0)

const ProductDetails = ({ product, category, subcategory, reviewStats, variants = [] }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const auth = useSelector((store) => store.authStore.auth)
  const cartItems = useSelector((store) => store.bookingStore.productCart || [])
  const minimumQuantity = product.minimumOrderQuantity || 1
  const [activeVariantId, setActiveVariantId] = useState(variants[0]?._id || '')
  const activeVariant = variants.find((variant) => variant._id === activeVariantId)
  const variantMedia = activeVariant?.media?.length ? activeVariant.media : product.media
  const images = variantMedia?.length ? variantMedia : [{ secure_url: placeholder.src, alt: product.name }]
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(minimumQuantity)
  const [imageOpen, setImageOpen] = useState(false)
  const price = activeVariant?.price ?? product.price
  const discountPercentage = activeVariant?.discountPercentage ?? product.discountPercentage ?? 0
  const discountedPrice = price * (1 - discountPercentage / 100)
  const imageIndex = Math.min(activeImage, images.length - 1)
  const imageUrl = images[imageIndex]?.secure_url || placeholder.src
  const stockType = activeVariant?.stockType || product.stockType
  const stockQuantity = activeVariant?.stockQuantity ?? product.stockQuantity
  const processingTime = activeVariant?.processingTime || product.processingTime
  const inquirePrice = activeVariant?.inquirePrice ?? product.inquirePrice
  const sku = activeVariant?.sku || product.sku
  const maxQuantity = stockType === 'in_stock' ? stockQuantity : null
  const unavailable = inquirePrice || (stockType === 'in_stock' && (!stockQuantity || quantity > stockQuantity))
  const productUrl = SHOP_PRODUCT_DETAILS(category.slug, product.slug)
  const [messaging, setMessaging] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const handleMessageSeller = async () => {
    setMessaging(true)
    try {
      const { data } = await messageApi.post('/conversation/create', { productId: product._id })
      if (!data.success) throw new Error(data.message || 'Could not start a conversation.')
      router.push(`/user/messages/${data.data._id}`)
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message || 'Could not start a conversation.')
    } finally {
      setMessaging(false)
    }
  }

  const handleAddToCart = () => {
    dispatch(addToProductCart({
      productId: product._id,
      variantId: activeVariant?._id || null,
      productName: product.name,
      variantName: activeVariant?.name || null,
      productSlug: product.slug,
      categorySlug: category.slug,
      sku,
      image: imageUrl,
      stockType,
      processingTime,
      quantity,
      minimumQuantity,
      maxQuantity,
      unitPrice: discountedPrice,
    }))
    setCartOpen(true)
  }

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

  return (
    <main className='mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-12'>
      <nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
        <Link href={SHOP} className='hover:text-pink-900'>Shop</Link>
        <span className='px-2'>/</span>
        <Link href={SHOP_CATEGORY(category.slug)} className='hover:text-pink-900'>{category.category}</Link>
        {subcategory && <><span className='px-2'>/</span><span>{subcategory.shopSubCategory}</span></>}
        <span className='px-2'>/</span>
        <span className='text-gray-900'>{product.name}</span>
      </nav>

      <section className='grid gap-8 border-b border-gray-200 pb-10 md:grid-cols-2 lg:gap-12'>
        <div className='grid gap-3 sm:grid-cols-[76px_minmax(0,1fr)]'>
          <div className='order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col'>
            {images.map((image, index) => (
              <button
                key={image._id || image.secure_url || index}
                type='button'
                onClick={() => setActiveImage(index)}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={imageIndex === index}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 sm:h-19 sm:w-19 ${imageIndex === index ? 'border-pink-900' : 'border-gray-200'}`}
              >
                <Image src={image.secure_url || placeholder} fill alt={image.alt || product.name} sizes='76px' className='object-cover' unoptimized={Boolean(image.secure_url)} />
              </button>
            ))}
          </div>
          <button type='button' onClick={() => setImageOpen(true)} className='relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 sm:order-2' aria-label='View product image larger'>
            <Image src={imageUrl} fill alt={images[imageIndex]?.alt || product.name} sizes='(max-width: 768px) 100vw, 50vw' className='object-cover transition-transform duration-300 hover:scale-[1.02]' unoptimized={Boolean(images[imageIndex]?.secure_url)} priority />
          </button>
        </div>

        <div className='flex flex-col'>
          <p className='mb-2 text-xs font-semibold uppercase text-pink-800'>{category.category}{subcategory ? ` / ${subcategory.shopSubCategory}` : ''}</p>
          <h1 className='text-3xl font-semibold text-gray-900 sm:text-4xl'>{product.name}</h1>
          <div className='mt-3 flex items-center gap-2'>
            <Rating value={Number(reviewStats.averageRating) || 0} readOnly precision={0.1} size='small' />
            <span className='text-sm text-gray-600'>{reviewStats.count || 0} reviews</span>
          </div>

          {variants.length > 0 && (
            <div className='mt-5'>
              <p className='mb-2 text-sm font-semibold text-gray-900'>Options</p>
              <div className='flex flex-wrap gap-2'>
                {variants.map((variant) => (
                  <button
                    key={variant._id}
                    type='button'
                    aria-pressed={activeVariantId === variant._id}
                    onClick={() => {
                      setActiveVariantId(variant._id)
                      setActiveImage(0)
                      setQuantity(minimumQuantity)
                    }}
                    className={`cursor-pointer rounded-sm border px-3 py-2 text-sm ${activeVariantId === variant._id ? 'border-pink-900 bg-pink-900 text-white' : 'border-gray-300 text-gray-800 hover:border-pink-900'}`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mt-6 flex flex-wrap items-baseline gap-3'>
            {inquirePrice ? (
              <p className='text-2xl font-bold text-pink-900'>Price on request</p>
            ) : (
              <>
                <span className='text-3xl font-bold text-pink-900'>{formatPrice(discountedPrice)}</span>
                {discountPercentage > 0 && (
                  <span className='text-lg text-gray-500 line-through'>{formatPrice(price)}</span>
                )}
                <span className='text-sm text-gray-500'>per item</span>
              </>
            )}
          </div>

          <div
            className='mt-5 leading-7 text-gray-700 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />
          <a rel="stylesheet" href="#desc" >See More</a>


          <div className='mt-6 grid gap-3 border-y border-gray-200 py-5 text-sm sm:grid-cols-2'>
            <div>
              <p className='text-gray-500'>Minimum order</p>
              <p className='mt-1 font-semibold text-gray-900'>{minimumQuantity} {minimumQuantity === 1 ? 'item' : 'items'}</p>
            </div>
            <div>
              <p className='text-gray-500'>Availability</p>
              <p className='mt-1 font-semibold text-gray-900'>
                {stockType === 'made_to_order'
                  ? 'Made to order'
                  : stockQuantity > 0 ? `In stock · ${stockQuantity} available` : 'Currently out of stock'}
              </p>
            </div>
            {processingTime?.value > 0 && (
              <div>
                <p className='text-gray-500'>Estimated making time</p>
                <p className='mt-1 font-semibold text-gray-900'>
                  {processingTime.value} {processingTime.unit}
                  {processingTime.value !== 1 ? 's' : ''}
                </p>

              </div>
            )}
            {product.userId?.name && (
              <div>
                <p className='text-gray-500'>Seller</p>
                <p className='mt-1 font-semibold text-gray-900'>{product.userId.name}</p>
              </div>
            )}
            {sku && (
              <div>
                <p className='text-gray-500'>SKU</p>
                <p className='mt-1 font-semibold text-gray-900'>{sku}</p>
              </div>
            )}
          </div>

          <div className='mt-5 flex flex-wrap items-center gap-4'>
            <p className='text-sm font-semibold text-gray-900'>Quantity</p>
            <div className='flex h-10 items-center border border-gray-300'>
              <button
                type='button'
                onClick={() => setQuantity((current) => Math.max(minimumQuantity, current - 1))}
                disabled={quantity <= minimumQuantity}
                aria-label='Decrease quantity'
                className='flex h-full w-10 items-center justify-center disabled:cursor-not-allowed disabled:text-gray-300'
              ><Minus size={16} /></button>
              <span aria-live='polite' className='min-w-12 text-center text-sm font-medium'>{quantity}</span>
              <button type='button' onClick={() => setQuantity((current) => current + 1)} disabled={maxQuantity !== null && quantity >= maxQuantity} aria-label='Increase quantity' className='flex h-full w-10 items-center justify-center disabled:cursor-not-allowed disabled:text-gray-300'><Plus size={16} /></button>
            </div>
            <span className='text-sm text-gray-500'>Minimum {minimumQuantity}</span>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            {!auth ? (
              <Button asChild variant='outline' className='min-h-11 border-pink-900 text-pink-900 hover:bg-pink-50'>
                <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(productUrl)}`}>Login to message seller</Link>
              </Button>
            ) : (
              <ButtonLoading
                type='button'
                loading={messaging}
                text='Message seller'
                onClick={handleMessageSeller}
                className='min-h-11 w-full rounded-md bg-white text-pink-900 border border-pink-900 hover:bg-pink-50'
              />
            )}
            <Button type='button' disabled={unavailable} onClick={handleAddToCart} className='min-h-11 bg-pink-900 text-white hover:bg-pink-800'>
              <ShoppingCart size={17} aria-hidden='true' />
              {inquirePrice ? 'Price on request' : stockType === 'in_stock' && !stockQuantity ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>
          {product.userId?.name && <p className='mt-4 text-sm text-gray-500'>Sold by {product.userId.name}</p>}
        </div>
      </section>

      <section className='py-8' id='desc'>
        <h2 className='mb-4 text-2xl font-semibold text-gray-900 '>Product details</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
      </section>

      <ListingReview productId={product._id} />

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className='flex w-full flex-col sm:max-w-md'>
          <SheetHeader className='border-b border-gray-200 pb-4'>
            <SheetTitle>Added to cart</SheetTitle>
          </SheetHeader>
          <div className='flex-1 overflow-y-auto px-4'>
            <p className='mb-4 text-sm text-gray-600'>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'standard'}`} className='flex gap-3 border-b border-gray-100 py-4'>
                <div className='relative h-16 w-16 shrink-0 overflow-hidden bg-gray-100'>
                  <Image src={item.image || placeholder} fill alt={item.productName} sizes='64px' className='object-cover' unoptimized={Boolean(item.image)} />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='line-clamp-2 text-sm font-medium text-gray-900'>{item.productName}</p>
                  {item.variantName && <p className='text-xs text-gray-500'>{item.variantName}</p>}
                  <p className='mt-1 text-sm text-gray-700'>{item.quantity} × {formatPrice(item.unitPrice)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='space-y-3 border-t border-gray-200 p-4'>
            <div className='flex justify-between font-semibold text-gray-900'>
              <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
            </div>
            <Button asChild className='w-full bg-pink-900 text-white hover:bg-pink-800' onClick={() => setCartOpen(false)}>
              <Link href={SHOP_CHECKOUT}>Proceed to checkout</Link>
            </Button>
            <Button asChild className='w-full bg-pink-900 text-white hover:bg-pink-800' onClick={() => setCartOpen(false)}>
              <Link href={SHOP_CART}>View cart</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {imageOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4' role='dialog' aria-modal='true' aria-label='Product image viewer' onClick={() => setImageOpen(false)}>
          <button type='button' aria-label='Close image viewer' onClick={() => setImageOpen(false)} className='absolute right-5 top-5 rounded-full p-2 text-white hover:bg-white/10'><X size={28} /></button>
          <div className='relative h-[85vh] w-full max-w-5xl' onClick={(event) => event.stopPropagation()}>
            <Image src={imageUrl} fill alt={images[imageIndex]?.alt || product.name} sizes='90vw' className='object-contain' unoptimized={Boolean(images[imageIndex]?.secure_url)} />
          </div>
        </div>
      )}
    </main>
  )
}

export default ProductDetails