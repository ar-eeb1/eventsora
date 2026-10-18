'use client'

import useFetch from '@/hooks/useFetch'
import ProductDetails from './ProductDetails'

const ShopProductLoader = ({ categorySlug, productSlug }) => {
  const { data, loading, error } = useFetch(
    `/api/website/shop-product/${encodeURIComponent(productSlug)}?category=${encodeURIComponent(categorySlug)}`
  )

  if (loading || !data) return <p className='py-24 text-center text-gray-500'>Loading product...</p>
  if (error || !data?.data) {
    return <p role='alert' className='py-24 text-center text-gray-600'>This product could not be found.</p>
  }

  return <ProductDetails {...data.data} />
}

export default ShopProductLoader