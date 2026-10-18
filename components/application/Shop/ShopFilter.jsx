'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import { SHOP_CATEGORY } from '@/routes/WebsiteRoute'

const MAX_PRICE = 1000000
const formatPrice = (value) => Number(value).toLocaleString('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
})

const ShopFilter = ({ categorySlug, subcategories }) => {
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()

  return (
    <ShopFilterContent
      key={queryString}
      categorySlug={categorySlug}
      subcategories={subcategories}
      queryString={queryString}
    />
  )
}

const ShopFilterContent = ({ categorySlug, subcategories, queryString }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = new URLSearchParams(queryString)
  const selectedSubcategories = searchParams.get('subcategory')?.split(',').filter(Boolean) || []
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0,
    searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : MAX_PRICE,
  ])

  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(params.size ? `${pathname}?${params.toString()}` : pathname)
  }

  const toggleSubcategory = (slug) => {
    const next = selectedSubcategories.includes(slug)
      ? selectedSubcategories.filter((value) => value !== slug)
      : [...selectedSubcategories, slug]
    setSelectedSubcategories(next)
    updateQuery({ subcategory: next.join(',') })
  }

  const filterContent = (
    <div className='text-gray-900'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <p className='text-sm font-semibold uppercase'>Filter products</p>
        {searchParams.size > 0 && (
          <Button asChild variant='link' className='h-auto px-0 text-pink-900'>
            <a href={SHOP_CATEGORY(categorySlug)}>Clear filters</a>
          </Button>
        )}
      </div>
      <Accordion type='multiple' defaultValue={['subcategory', 'price']}>
        <AccordionItem value='subcategory'>
          <AccordionTrigger className='font-semibold uppercase hover:no-underline'>Subcategory</AccordionTrigger>
          <AccordionContent>
            <ul className='max-h-56 space-y-3 overflow-auto'>
              {subcategories.map((subcategory) => (
                <li key={subcategory._id}>
                  <label className='flex cursor-pointer items-center gap-3 text-sm'>
                    <Checkbox
                      checked={selectedSubcategories.includes(subcategory.slug)}
                      onCheckedChange={() => toggleSubcategory(subcategory.slug)}
                    />
                    <span>{subcategory.shopSubCategory}</span>
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='price'>
          <AccordionTrigger className='font-semibold uppercase hover:no-underline'>Price</AccordionTrigger>
          <AccordionContent>
            <Slider
              className='my-4'
              value={priceRange}
              min={0}
              max={MAX_PRICE}
              step={500}
              onValueChange={setPriceRange}
              aria-label='Product price range'
            />
            <div className='flex justify-between text-xs text-gray-600'>
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Button
              type='button'
              className='mt-4 w-full bg-pink-900 text-white hover:bg-pink-800'
              onClick={() => updateQuery({
                minPrice: priceRange[0] > 0 ? String(priceRange[0]) : '',
                maxPrice: priceRange[1] < MAX_PRICE ? String(priceRange[1]) : '',
              })}
            >
              Apply price
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <>
      <aside className='sticky top-24 hidden h-fit rounded-md border border-gray-200 bg-white p-4 lg:block'>
        {filterContent}
      </aside>
      <div className='mb-5 lg:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button type='button' variant='outline' className='gap-2 border-gray-300'>
              <SlidersHorizontal size={16} aria-hidden='true' /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Filter products</SheetTitle>
            </SheetHeader>
            <div className='px-4 pb-6'>{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default ShopFilter