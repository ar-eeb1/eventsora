'use client'

import ProductBox from '@/components/application/Shop/ProductBox'
import useFetch from '@/hooks/useFetch'
import { useSearchParams } from 'next/navigation'

const ShopCategoryProducts = ({ categorySlug, categoryName }) => {
  const searchParams = useSearchParams()
  const query = new URLSearchParams({ category: categorySlug })
  const subcategory = searchParams.get('subcategory')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  if (subcategory) query.set('subcategory', subcategory)
  if (minPrice) query.set('minPrice', minPrice)
  if (maxPrice) query.set('maxPrice', maxPrice)
  const { data, loading, error } = useFetch(`/api/website/shop-products?${query.toString()}`)
  const products = data?.data || []

  if (loading || !data) {
    return <p className='py-16 text-center text-gray-500'>Loading products...</p>
  }
  if (error) {
    return <p role='alert' className='py-16 text-center text-red-700'>Products could not be loaded.</p>
  }
  if (!products.length) {
    return <p className='py-16 text-center text-gray-600'>No approved products in this category yet.</p>
  }

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => (
        <ProductBox
          key={product._id}
          product={product}
          categoryName={categoryName}
          categorySlug={categorySlug}
        />
      ))}
    </div>
  )
}

export default ShopCategoryProducts