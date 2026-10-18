import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Package } from 'lucide-react'
import placeholder from '@/public/assets/img-placeholder.png'
import { SHOP_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const formatPrice = (price) => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
}).format(price || 0)

const ProductBox = ({ product, categoryName, categorySlug, className = '' }) => {
  const imageUrl = product.media?.[0]?.secure_url
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100)

  return (
    <Link
      href={SHOP_PRODUCT_DETAILS(categorySlug, product.slug)}
      className={`group block overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className='relative h-52 overflow-hidden bg-gray-100'>
        <Image
          src={imageUrl || placeholder}
          fill
          alt={product.media?.[0]?.alt || product.name}
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          unoptimized={Boolean(imageUrl)}
        />
        {product.discountPercentage > 0 && (
          <span className='absolute left-3 top-3 rounded-sm bg-pink-900 px-2 py-1 text-xs font-semibold text-white'>
            {product.discountPercentage}% off
          </span>
        )}
      </div>
      <div className='space-y-3 p-4'>
        <p className='text-xs font-semibold uppercase text-pink-800'>{categoryName || 'Eventsora Shop'}</p>
        <h2 className='line-clamp-1 text-lg font-semibold text-gray-900'>{product.name}</h2>
        <div className='flex flex-wrap items-baseline gap-2'>
          {product.inquirePrice ? (
            <p className='text-lg font-bold text-pink-900'>Price on request</p>
          ) : (
            <>
              <span className='text-xl font-bold text-pink-900'>{formatPrice(discountedPrice)}</span>
              {product.discountPercentage > 0 && (
                <span className='text-sm text-gray-500 line-through'>{formatPrice(product.price)}</span>
              )}
            </>
          )}
        </div>
        <div className='flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-sm text-gray-600'>
          <span className='flex min-w-0 items-center gap-1.5'>
            <Package size={15} aria-hidden='true' />
            <span className='truncate'>Minimum order: {product.minimumOrderQuantity || 1}</span>
          </span>
          <ArrowUpRight size={17} className='shrink-0 text-pink-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' aria-hidden='true' />
        </div>
      </div>
    </Link>
  )
}

export default ProductBox