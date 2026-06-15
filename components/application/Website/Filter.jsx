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
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

const Filter = () => {
  const [capacityFilter, setCapacityFilter] = useState({ minCapacity: 0, maxCapacity: 3000 })
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 1000000 })

  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedSubcategory, setSelectedSubcategory] = useState([])
  const [city, setCity] = useState([])
  const [locality, setLocality] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const category = params.category
  const [subcategoryList, setSubcategoryList] = useState([])
  const { data: subcategoryData } = useFetch(`/api/website/subcategory?type=${category}`);

  const { data: cityData } = useFetch(`/api/website/location/city`)
  const { data: localityData } = useFetch(`/api/website/location/locality?city=${city.join(',')}`)

  const urlSearchParams = new URLSearchParams(searchParams.toString())

  useEffect(() => {
    searchParams.get('subcategory') ? setSelectedSubcategory(searchParams.get('subcategory').split(',')) : setSelectedSubcategory([])
    searchParams.get('city') ? setCity(searchParams.get('city').split(',')) : setCity([])
    searchParams.get('locality') ? setLocality(searchParams.get('locality').split(',')) : setLocality([])
    searchParams.get('startDate') ? setStartDate(searchParams.get('startDate')) : setStartDate('')
    searchParams.get('endDate') ? setEndDate(searchParams.get('endDate')) : setEndDate('')
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

  const handleCityFilter = (cityId) => {
    let newSelectedCity = [...city]
    if (newSelectedCity.includes(cityId)) {
      newSelectedCity = newSelectedCity.filter(c => c !== cityId)
    } else {
      newSelectedCity.push(cityId)
    }
    setCity(newSelectedCity)
    newSelectedCity.length > 0 ? urlSearchParams.set('city', newSelectedCity.join(',')) : urlSearchParams.delete('city')

    // Clear locality when city changes
    setLocality([])
    urlSearchParams.delete('locality')

    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)
  }

  const handleLocalityFilter = (localityId) => {
    let newSelectedLocality = [...locality]
    if (newSelectedLocality.includes(localityId)) {
      newSelectedLocality = newSelectedLocality.filter(l => l !== localityId)
    } else {
      newSelectedLocality.push(localityId)
    }
    setLocality(newSelectedLocality)
    newSelectedLocality.length > 0 ? urlSearchParams.set('locality', newSelectedLocality.join(',')) : urlSearchParams.delete('locality')
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

  const handleDateFilter = () => {
    if (startDate) {
      urlSearchParams.set('startDate', startDate)
    } else {
      urlSearchParams.delete('startDate')
    }
    if (endDate) {
      urlSearchParams.set('endDate', endDate)
    } else {
      urlSearchParams.delete('endDate')
    }
    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)
  }

  return (

    <div className='text-black'>
      {searchParams.size > 0 &&
        <Button variant='destructive' className='w-full' asChild type='button'>
          <Link href={WEBSITE_CATEGORY(`${category}`)}>
            Clear Filters
          </Link>
        </Button>}

      <Accordion type="multiple" defaultValue={['1', '2', '3', '4', '5']}>
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
            City
          </AccordionTrigger>
          <AccordionContent>
            <div className='max-h-48 overflow-auto'>
              <ul>
                {cityData && cityData.success && cityData.data.map((c) => (
                  <li key={c._id} className='mb-3'>
                    <label className='flex items-center space-x-3 cursor-pointer'>
                      <Checkbox
                        onCheckedChange={() => handleCityFilter(c._id)}
                        checked={city.includes(c._id)}
                      />
                      <span>{c.city}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {city.length > 0 && (
          <AccordionItem value="5">
            <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
              Locality
            </AccordionTrigger>
            <AccordionContent>
              <div className='max-h-48 overflow-auto'>
                <ul>
                  {localityData && localityData.success && localityData.data.length > 0 ? (
                    localityData.data.map((l) => (
                      <li key={l._id} className='mb-3'>
                        <label className='flex items-center space-x-3 cursor-pointer'>
                          <Checkbox
                            onCheckedChange={() => handleLocalityFilter(l._id)}
                            checked={locality.includes(l._id)}
                          />
                          <span>{l.locality}</span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li>No localities found</li>
                  )}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="3">
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
              <ButtonLoading onClick={handlePriceFilter} type='button' text='Filter Price' className='rounded-full ' />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="4">
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

      <Accordion type="multiple" defaultValue={['6']} className='mt-2'>
        <AccordionItem value="6">
          <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
            AVAILABILITY DATE
          </AccordionTrigger>
          <AccordionContent>
            <div className='flex gap-2 mb-3 flex-col'>
              <div className='w-full'>
                <span className='text-xs mb-1 block'>From</span>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className='w-full'>
                <span className='text-xs mb-1 block'>To</span>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
            <div className='mt-2 flex gap-2'>
              <ButtonLoading onClick={handleDateFilter} type='button' text='Filter Date' className='rounded-full w-full' />
              {(searchParams.get('startDate') || searchParams.get('endDate')) && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className='rounded-full w-full'
                  onClick={() => {
                    setStartDate('')
                    setEndDate('')
                    urlSearchParams.delete('startDate')
                    urlSearchParams.delete('endDate')
                    router.push(`${WEBSITE_CATEGORY(`${category}`)}?${urlSearchParams}`)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Filter
