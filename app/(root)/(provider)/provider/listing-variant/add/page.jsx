'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import Select from '@/components/application/Main/Select'
import { numberToIndianWords } from '@/lib/numberToWords'
import Editor from '@/components/application/Provider/Editor'
import MediaModal from '@/components/application/Provider/MediaModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { pricingType } from '@/lib/utils'
import { zSchema } from '@/lib/zodSchema'
import SublocalityModel from '@/models/Sublocality.model'
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_SHOW, PROVIDER_LISTING_VARIANT_SHOW } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_LISTING_VARIANT_SHOW, label: 'Variant' },
  { href: '', label: 'Add Variant' },
]

const AddListingVariant = () => {
  //MEDIA MODAL STATES

  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)

  const [listingOptions, setListingOptions] = useState([])
  const { data: getListing } = useFetch('/api/provider/listing?deleteType=SD&&size=10000')
  useEffect(() => {
    if (getListing && getListing.success) {
      const data = getListing.data
      const options = data.map((list) => ({ label: list.name, value: list._id }))
      setListingOptions(options)
    }
  }, [getListing])

  // PRICE TYPE
  const [pricingOptions, setPricingOptions] = useState([])
  useEffect(() => {
    const options = pricingType.map(type => ({
      label: type,
      value: type
    }))
    setPricingOptions(options)
  }, [])


  const formSchema = zSchema.pick({
    listingId: true,
    title: true,
    serviceCode: true,
    startingPrice: true,
    pricingType: true,
    minPersons: true,
    points: true,
    availability: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingId: '',
      title: '',
      serviceCode: '',
      startingPrice: Number(0),
      pricingType: '',
      minPersons: 1,
      availability: {
        monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true
      },
    }
  })

  // POINTS HANDLER
  const [pointInput, setPointInput] = useState('')
  const handleAddPoint = (e) => {
    e.preventDefault()
    if (!pointInput.trim()) return

    const currentPoints = form.getValues('points') || []
    form.setValue('points', [...currentPoints, pointInput.trim()])
    setPointInput('')
  }

  const handleRemovePoint = (index) => {
    const currentPoints = form.getValues('points') || []
    const newPoints = currentPoints.filter((_, i) => i !== index)
    form.setValue('points', newPoints)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPoint(e)
    }
  }


  // SUBMIT
  const onSubmit = async (values) => {

    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/provider/listing-variant/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      // form.reset()
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className=" dark:from-gray-900 dark:to-gray-800 ">
      <div className="w-[calc(100%-1%)] mx-auto">
        <BreadCrumb breadCrumbData={breadCrumbData} />

        <Card className='rounded-xl shadow-lg border-0 overflow-hidden'>
          <CardHeader className='px-3 border-b [.border-b]:pb-2'>
            <h4 className='text-xl font-semibold'>Add Listing Variant</h4>
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Basic Information</h5>
                  </div>

                  <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                    {/* LISTING */}
                    <FormField control={form.control} name="listingId" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Listing<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={listingOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Listing'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />


                    {/* LISTING TITLE */}
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Listing Title<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Enter listing variant title'
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* SERVICE CODE */}
                    <FormField control={form.control} name="serviceCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Service Code<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Service Code'
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />


                    {/*  PRICE */}
                    <FormField control={form.control} name="startingPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Price<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <div className="">
                            <Input
                              type='number'
                              placeholder='0.00'
                              className="h-11  transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              {...field}
                            />
                            {field.value && (
                              <p className="text-xs text-muted-foreground mt-1 font-medium capitalize">
                                {numberToIndianWords(field.value)}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* PRICING TYPE */}
                    <FormField control={form.control} name="pricingType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Pricing Type<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={pricingOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Pricing Option'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* MINIMUM PERSONS */}
                    {form.watch('pricingType') === 'per_person' && (
                      <FormField control={form.control} name="minPersons" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Minimum Persons<span className='text-red-500 ml-1'>*</span></FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter minimum persons required'
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              min='1'
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                  </div>
                </div>


                {/* POINTS */}
                <div className="md:col-span-2 space-y-4">
                  <FormLabel className="text-sm font-medium">Points (Offerings)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={pointInput}
                      onChange={(e) => setPointInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Add a point (e.g. 1 Day Shoot)"
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      type="button"
                      onClick={handleAddPoint}
                      className="h-11 px-6"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Points List */}
                  <div className="space-y-2">
                    {form.watch('points')?.map((point, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 group hover:border-primary/20 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {point}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePoint(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                    {(!form.watch('points') || form.watch('points').length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 text-sm">
                        No points added yet. Add points to describe what this package includes.
                      </div>
                    )}
                  </div>
                </div>

                {/* WEEKLY AVAILABILITY */}
                <div className="md:col-span-2 space-y-4 bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <h6 className="text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider">Default Weekly Availability</h6>
                  </div>
                  <p className="text-xs text-gray-500">Uncheck days where this variant is permanently unavailable (e.g. hall closed on Mondays).</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-4 mt-2">
                    {[
                      { id: 'monday', label: 'Mon' },
                      { id: 'tuesday', label: 'Tue' },
                      { id: 'wednesday', label: 'Wed' },
                      { id: 'thursday', label: 'Thu' },
                      { id: 'friday', label: 'Fri' },
                      { id: 'saturday', label: 'Sat' },
                      { id: 'sunday', label: 'Sun' },
                    ].map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name={`availability.${day.id}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium cursor-pointer">
                              {day.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className='pt-6 border-t flex justify-end gap-4'>
                  <ButtonLoading
                    loading={loading}
                    type='submit'
                    text='Add Listing Variant'
                    className="h-12 px-8 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddListingVariant
