'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React, { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { Checkbox } from '@/components/ui/checkbox'
import { useParams, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import ButtonLoading from '../ButtonLoading'
import { useRouter } from 'next/navigation'
import { WEBSITE_CATEGORY } from '@/routes/WebsiteRoute'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Filter = () => {
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 1000000 })
  const [capacityFilter, setCapacityFilter] = useState({ minCapacity: 0, maxCapacity: 3000 })


  const params = useParams()
  const searchParams = useSearchParams()
  const [selectedSubcategory, setSelectedSubcategory] = useState([])


  const category = params.category
  const [subcategoryList, setSubcategoryList] = useState([])
  const { data: subcategoryData } = useFetch(`/api/website/subcategory?type=${category}`);

  const urlSearchParams = new URLSearchParams(searchParams.toString())
  const router = useRouter()

  useEffect(() => {
    searchParams.get('subcategory') ? setSelectedSubcategory(searchParams.get('subcategory').split(',')) : setSelectedSubcategory([])
  }, [searchParams])



  useEffect(() => {
    if (subcategoryData?.data) {
      setSubcategoryList(subcategoryData.data)
    }
  }, [subcategoryData])

  const handlePriceChange = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
  }

  const handleCapacityChange = (value) => {
    setCapacityFilter({ minCapacity: value[0], maxCapacity: value[1] })
  }

  const handleSubcategoryFilter = (subcategorySlug) => {
    let newSelectedSubcategory = [...selectedSubcategory]
    if (newSelectedSubcategory.includes(subcategorySlug)) {
      newSelectedSubcategory = newSelectedSubcategory.filter(sub => sub !== subcategorySlug)
    } else {
      newSelectedSubcategory.push(subcategorySlug)
    }
    setSelectedSubcategory(newSelectedSubcategory)
    newSelectedSubcategory.length > 0 ? urlSearchParams.set('subcategory', newSelectedSubcategory.join(',')) : urlSearchParams.delete('subcategory')
    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)
  }

  const handlePriceFilter = () => {
    urlSearchParams.set('minPrice', priceFilter.minPrice)
    urlSearchParams.set('maxPrice', priceFilter.maxPrice)
    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)

  }
  const handleCapacityFilter = () => {
    urlSearchParams.set('minCapacity', capacityFilter.minCapacity)
    urlSearchParams.set('maxCapacity', capacityFilter.maxCapacity)
    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)
  }

  return (

    <div>
      {searchParams.size > 0 &&
        <Button variant='destructive' className='w-full' asChild type='button'>
          <Link href={WEBSITE_CATEGORY(`${category}`)}>
            Clear Filters
          </Link>
        </Button>}

      <Accordion type="multiple" defaultValue={['1', '2', '3', '4']}>
        <AccordionItem value="1">
          <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
            Find in {category}
          </AccordionTrigger>
          <AccordionContent>
            <div className='max-h-48 overflow-auto'>
              <ul>
                {subcategoryData && subcategoryData.success && subcategoryData.data.map((subcategory) => (
                  <li key={subcategory._id} className='mb-3'>
                    <label className='flex items-center space-x-3 cursor-pointer'>
                      <Checkbox
                        onCheckedChange={() => handleSubcategoryFilter(subcategory.slug)}
                        checked={selectedSubcategory.includes(subcategory.slug)}
                      />
                      <span>{subcategory.subcategory}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
            PRICE
          </AccordionTrigger>
          <AccordionContent className=''>
            <Slider className='my-3' defaultValue={[0, 1000000]} max={1000000} step={1} onValueChange={handlePriceChange} />
            <div className='flex justify-between'>
              <span>{priceFilter.minPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
              <span>{priceFilter.maxPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
            </div>

            <div className='mt-2'>
              <ButtonLoading onClick={handlePriceFilter} type='button' text='Filter Price' className='rounded-full' />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="3">
          <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
            CAPACITY
          </AccordionTrigger>
          <AccordionContent>
            <Slider className='my-3' defaultValue={[0, 3000]} max={3000} step={1} onValueChange={handleCapacityChange} />
            <div className='flex justify-between'>
              <span>{capacityFilter.minCapacity}</span>
              <span>{capacityFilter.maxCapacity}</span>
            </div>

            <div className='mt-2'>
              <ButtonLoading onClick={handleCapacityFilter} type='button' text='Filter Capacity' className='rounded-full' />
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}

export default Filter
