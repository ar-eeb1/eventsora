'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import Select from '@/components/application/Main/Select'
import Editor from '@/components/application/Provider/Editor'
import MediaModal from '@/components/application/Provider/MediaModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
  console.log(listingOptions);


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
    listing: true,
    title: true,
    serviceCode: true,
    startingPrice: true,
    pricingType: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listing: '',
      title: '',
      serviceCode: '',
      startingPrice: Number(0),
      pricingType: '',
    }
  })


  // SUBMIT
  const onSubmit = async (values) => {
    console.log(values);
    if (selectedMedia.length <= 0) {
      return showToast('error', 'Please Select Media')
    }
    const mediaIds = selectedMedia.map(media => media._id)
    values.media = mediaIds

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
                    <FormField control={form.control} name="listing" render={({ field }) => (
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
                        <FormLabel className="text-sm font-medium">Starting Price<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <div className="">
                            <Input
                              type='number'
                              placeholder='0.00'
                              className="h-11  transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* PRICING TYPE */}
                    <FormField control={form.control} name="pricingType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Listing<span className='text-red-500 ml-1'>*</span></FormLabel>
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



                  </div>
                </div>


                {/* Media Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Media Gallery</h5>
                  </div>

                  <div className='rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center bg-linear-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 transition-all duration-200 hover:border-primary/50'>
                    <MediaModal
                      open={open}
                      setOpen={setOpen}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      isMultiple={true}
                    />
                    {selectedMedia.length > 0 && (
                      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6'>
                        {selectedMedia.map((media, index) => (
                          <div
                            key={media._id}
                            className='relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 group'
                          >
                            <Image
                              src={media.url}
                              alt={media.alt || `Media ${index + 1}`}
                              fill
                              className='object-cover'
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">#{index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type='button'
                      onClick={() => setOpen(true)}
                      className='h-12 px-8 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105'
                    >
                      {selectedMedia.length > 0 ? 'Change Media' : 'Select Media'}
                    </Button>
                    {selectedMedia.length > 0 && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {selectedMedia.length} {selectedMedia.length === 1 ? 'image' : 'images'} selected
                      </p>
                    )}
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
