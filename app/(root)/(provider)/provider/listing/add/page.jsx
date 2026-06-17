'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { numberToIndianWords } from '@/lib/numberToWords'
import Select from '@/components/application/Main/Select'
import Editor from '@/components/application/Provider/Editor'
import MediaModal from '@/components/application/Provider/MediaModal'
import UploadMedia from '@/components/application/Provider/UploadMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar as CalendarIcon } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { Checkbox } from '@/components/ui/checkbox'
import SublocalityModel from '@/models/Sublocality.model'
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_SHOW } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_LISTING_SHOW, label: 'Listing' },
  { href: '', label: 'Add Listing' },
]

const AddListing = () => {
  //MEDIA MODAL STATES

  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    subcategory: true,
    startingPrice: true,
    description: true,
    country: true,
    state: true,
    city: true,
    locality: true,
    sublocality: true,
    address: true,
    capacity: true,
    inquirePrice: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      subcategory: '',
      startingPrice: '',
      description: '',
      country: '',
      state: '',
      city: '',
      locality: '',
      sublocality: undefined,
      address: '',
      capacity: undefined,
      inquirePrice: false,
    }
  })

  const sortByLabel = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })

  // WATCH SELECTED CATEGORY
  const selectedCategory = form.watch('category');

  // FETCH CATEGORIES
  const [categoryOptions, setCategoryOptions] = useState([])
  const { data: getCategory } = useFetch('/api/master/category?deleteType=SD&&size=10000')

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const options = getCategory.data.map(cat => ({ label: cat.category, value: cat._id }))
      setCategoryOptions(options)
    }
  }, [getCategory])

  // Check if selected category is "Venue"
  const isVenueCategory = categoryOptions.find(cat => cat.value === selectedCategory)?.label?.toLowerCase() === 'venues'

  // FETCH SUBCATEGORIES
  const [subcategoryOptions, setSubcategoryOptions] = useState([])
  const { data: getSubcategoryData } = useFetch('/api/master/subcategory?deleteType=SD&&size=10000')
  const [filteredSubcategories, setFilteredSubcategories] = useState([])

  useEffect(() => {
    if (getSubcategoryData && getSubcategoryData.success) {
      const options = getSubcategoryData.data.map(subcat => ({
        label: subcat.subcategory,
        value: subcat._id,
        categoryId: subcat.categoryId
      }))
      setSubcategoryOptions(options)
    }
  }, [getSubcategoryData])

  // FILTER SUBCATEGORIES BASED ON SELECTED CATEGORY
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategoryOptions.filter(
        subcat => subcat.categoryId === selectedCategory
      )
      setFilteredSubcategories(filtered)
    } else {
      setFilteredSubcategories([])
      form.setValue('subcategory', '') // reset subcategory if category changes
    }
  }, [selectedCategory, subcategoryOptions])

  // WATCH COUNTRY
  const selectedCountry = form.watch('country');
  // FETCH COUNTRY
  const [countryOptions, setCountryOptions] = useState([])
  const { data: getCountry } = useFetch('/api/master/location/country?deleteType=SD&&size=1000')

  useEffect(() => {
    if (getCountry && getCountry.success) {
      const options = getCountry.data.map(coun => ({ label: coun.country, value: coun._id })).sort(sortByLabel)
      setCountryOptions(options)
    }
  }, [getCountry])

  // FETCH STATES
  const [stateOptions, setStateOptions] = useState([])
  const { data: getStateData } = useFetch('/api/master/location/state?deleteType=SD&&size=1000')
  const [filteredStates, setFilteredStates] = useState([])
  useEffect(() => {
    if (getStateData && getStateData.success) {
      const options = getStateData.data.map(sta => ({
        label: sta.state,
        value: sta._id,
        countryId: sta.countryId,
      })).sort(sortByLabel)
      setStateOptions(options)
    }
  }, [getStateData])


  // FILTER STATES BASED ON COUNTRY SELECTION
  useEffect(() => {
    if (selectedCountry) {
      const filtered = stateOptions.filter(
        state => state.countryId === selectedCountry
      )
      setFilteredStates(filtered)
    } else {
      setFilteredStates([])
      form.setValue('state', '')
    }
  }, [selectedCountry, stateOptions])

  // FETCH CITY
  const selectedState = form.watch('state')
  const [cityOptions, setCityOptions] = useState([])
  const { data: getCityData } = useFetch('/api/master/location/city?deleteType=SD&&size=1000')
  const [filteredCities, setFilteredCities] = useState([])
  useEffect(() => {
    if (getCityData && getCityData.success) {
      const options = getCityData.data.map(cit => ({
        label: cit.city,
        value: cit._id,
        stateId: cit.stateId
      })).sort(sortByLabel)
      setCityOptions(options)
    }
  }, [getCityData])

  // FETCH CITY BASED ON STATE SELECTION
  useEffect(() => {
    if (selectedState) {
      const filtered = cityOptions.filter(
        city => city.stateId === selectedState
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities([])
      form.setValue('city', '')
    }
  }, [selectedState, cityOptions])

  //FETCH LOCALITIES
  const selectedCity = form.watch('city')
  const [localityOptions, setLocalityOptions] = useState([])
  const { data: getLocalityData } = useFetch('/api/master/location/locality?deleteType=SD&&size=1000')
  const [filteredLocalities, setFilteredLocalities] = useState([])
  useEffect(() => {
    if (getLocalityData && getLocalityData.success) {
      const options = getLocalityData.data.map(loc => ({
        label: loc.locality,
        value: loc._id,
        cityId: loc.cityId
      })).sort(sortByLabel)
      setLocalityOptions(options)
    }
  }, [getLocalityData])

  // FETCH LOCALITY BASED ON CITY SELECTION
  useEffect(() => {
    if (selectedCity) {
      const filtered = localityOptions.filter(
        locality => locality.cityId === selectedCity
      )
      setFilteredLocalities(filtered)
    } else {
      setFilteredLocalities([])
      form.setValue('locality', '')
    }
  }, [selectedCity, localityOptions])

  //FETCH SUBLOCALITIES
  const selectedLocality = form.watch('locality')
  const [sublocalityOptions, setSublocalityOptions] = useState([])
  const { data: getSublocalityData } = useFetch('/api/master/location/sublocality?deleteType=SD&&size=1000')
  const [filteredSublocalities, setFilteredSublocalities] = useState([])
  useEffect(() => {
    if (getSublocalityData && getSublocalityData.success) {
      const options = getSublocalityData.data.map(sub => ({
        label: sub.sublocality,
        value: sub._id,
        localityId: sub.localityId
      })).sort(sortByLabel)
      setSublocalityOptions(options)
    }
  }, [getSublocalityData])

  // FETCH SUBLOCALITY BASED ON LOCALITY SELECTION
  useEffect(() => {
    if (selectedLocality) {
      const filtered = sublocalityOptions.filter(
        sublocality => sublocality.localityId === selectedLocality
      )
      setFilteredSublocalities(filtered)
    } else {
      setFilteredSublocalities([])
      form.setValue('sublocality', null)
    }
  }, [selectedLocality, sublocalityOptions])

  // Check if sublocalities are available
  const hasSublocalities = filteredSublocalities.length > 0


  // AUTO GENERATE SLUG
  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])



  //CKEDITOR
  const editor = (event, editor) => {
    const data = editor.getData()
    form.setValue('description', data)
  }

  // SUBMIT
  const onSubmit = async (values) => {
    if (selectedMedia.length <= 0) {
      return showToast('error', 'Please Select Media')
    }
    const mediaIds = selectedMedia.map(media => media._id)
    values.media = mediaIds

    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/provider/listing/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset()
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
            <h4 className='text-xl font-semibold'>Add Listing</h4>
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Basic Information</h5>
                  </div>

                  <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                    {/* LISTING NAME */}
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Listing Name<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Enter listing name'
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* SLUG */}
                    <FormField control={form.control} name="slug" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Slug<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            disabled  
                            type='text'
                            placeholder='auto-generated-slug'
                            className="h-11 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* CATEGORY */}
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Category<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Category'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* SUBCATEGORY */}
                    <FormField control={form.control} name="subcategory" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Subcategory<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={filteredSubcategories}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Subcategory'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* STARTING PRICE */}
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
                    {/* INQUIRE PRICE */}
                    <FormField control={form.control} name="inquirePrice" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-primary/5 border-primary/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-semibold text-primary cursor-pointer">
                            Inquire Price
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            If checked, users will see "Inquire dates" instead of booking buttons and must message you for price.
                          </p>
                        </div>
                      </FormItem>
                    )} />
                    {/* CAPACITY - Conditional */}
                    {isVenueCategory && (
                      <FormField control={form.control} name="capacity" render={({ field }) => (
                        <FormItem className="transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                          <FormLabel className="text-sm font-medium">Capacity<span className='text-red-500 ml-1'>*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type='number'
                                placeholder='Enter venue capacity'
                                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                {...field}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">people</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Location Information</h5>
                  </div>

                  <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                    {/* ADDRESS */}
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Address<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Enter full address'
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* COUNTRY */}
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Country<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={countryOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Country'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* STATE */}
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">State<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={filteredStates}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select State'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* CITY */}
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">City<span className='text-red-500 ml-1'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={filteredCities}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select City'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* LOCALITY */}
                    <FormField control={form.control} name="locality" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Locality</FormLabel>
                        <FormControl>
                          <Select
                            options={filteredLocalities}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder='Select Locality'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* SUBLOCALITY - Conditional */}
                    {hasSublocalities && (
                      <FormField control={form.control} name="sublocality" render={({ field }) => (
                        <FormItem className="transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                          <FormLabel className="text-sm font-medium">Sublocality</FormLabel>
                          <FormControl>
                            <Select
                              options={filteredSublocalities}
                              selected={field.value}
                              setSelected={(value) => field.onChange(value || null)}
                              isMulti={false}
                              placeholder='Select Sublocality (optional)'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Description</h5>
                  </div>

                  <div>
                    <FormLabel className='mb-3 block text-sm font-medium'>Description<span className='text-red-500 ml-1'>*</span></FormLabel>
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
                      <Editor onChange={editor} />
                      <FormMessage />
                    </div>
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
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMedia(prev => prev.filter(m => m._id !== media._id));
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className='flex justify-center items-center gap-4'>
                      <Button
                        type='button'
                        onClick={() => setOpen(true)}
                        className='h-9 px-8 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105'
                      >
                        {selectedMedia.length > 0 ? 'Change Media' : 'Select Media'}
                      </Button>
                      <UploadMedia 
                        isMultiple={true} 
                        queryClient={queryClient} 
                        onUploadSuccess={(newMedia) => {
                          const formattedMedia = newMedia.map(m => ({ _id: m._id, url: m.secure_url }));
                          setSelectedMedia(prev => [...prev, ...formattedMedia]);
                        }}
                      />
                    </div>
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
                    text='Create Listing'
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

export default AddListing

// 'use client'
// import BreadCrumb from '@/components/application/BreadCrumb'
// import ButtonLoading from '@/components/application/ButtonLoading'
// import Select from '@/components/application/Main/Select'
// import Editor from '@/components/application/Provider/Editor'
// import MediaModal from '@/components/application/Provider/MediaModal'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import useFetch from '@/hooks/useFetch'
// import { showToast } from '@/lib/showToast'
// import { zSchema } from '@/lib/zodSchema'
// import SublocalityModel from '@/models/Sublocality.model'
// import { PROVIDER_DASHBOARD, PROVIDER_LISTING_SHOW } from '@/routes/ProviderPanelRoute'
// import { zodResolver } from '@hookform/resolvers/zod'
// import axios from 'axios'
// import Image from 'next/image'
// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import slugify from 'slugify'

// const breadCrumbData = [
//   { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
//   { href: PROVIDER_LISTING_SHOW, label: 'Listing' },
//   { href: '', label: 'Add Listing' },
// ]

// const AddListing = () => {
//   //MEDIA MODAL STATES

//   const [open, setOpen] = useState(false)
//   const [selectedMedia, setSelectedMedia] = useState([])

//   const [loading, setLoading] = useState(false)
//   const [fields, setFields] = useState(false)

//   const formSchema = zSchema.pick({
//     name: true,
//     slug: true,
//     category: true,
//     subcategory: true,
//     startingPrice: true,
//     // media: true,
//     description: true,
//     country: true,
//     state: true,
//     city: true,
//     locality: true,
//     sublocality: true,
//     address: true,
//     capacity: true,
//   })

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       slug: '',
//       category: '',
//       subcategory: '',
//       startingPrice: '',
//       // media: [],
//       description: '',
//       country: '',
//       state: '',
//       city: '',
//       locality: '',
//       sublocality: undefined,
//       address: '',
//       capacity: undefined,
//     }
//   })


//   // WATCH SELECTED CATEGORY
//   const selectedCategory = form.watch('category');

//   // FETCH CATEGORIES
//   const [categoryOptions, setCategoryOptions] = useState([])
//   const { data: getCategory } = useFetch('/api/master/category?deleteType=SD&&size=10000')

//   useEffect(() => {
//     if (getCategory && getCategory.success) {
//       const options = getCategory.data.map(cat => ({ label: cat.category, value: cat._id }))
//       setCategoryOptions(options)
//     }
//   }, [getCategory])

//   // FETCH SUBCATEGORIES
//   const [subcategoryOptions, setSubcategoryOptions] = useState([])
//   const { data: getSubcategoryData } = useFetch('/api/master/subcategory?deleteType=SD&&size=10000')
//   const [filteredSubcategories, setFilteredSubcategories] = useState([])

//   useEffect(() => {
//     if (getSubcategoryData && getSubcategoryData.success) {
//       const options = getSubcategoryData.data.map(subcat => ({
//         label: subcat.subcategory,
//         value: subcat._id,
//         categoryId: subcat.categoryId
//       }))
//       setSubcategoryOptions(options)
//     }
//   }, [getSubcategoryData])

//   // FILTER SUBCATEGORIES BASED ON SELECTED CATEGORY
//   useEffect(() => {
//     if (selectedCategory) {
//       const filtered = subcategoryOptions.filter(
//         subcat => subcat.categoryId === selectedCategory
//       )
//       setFilteredSubcategories(filtered)
//     } else {
//       setFilteredSubcategories([])
//       form.setValue('subcategory', '') // reset subcategory if category changes
//     }
//   }, [selectedCategory, subcategoryOptions])

//   // WATCH COUNTRY
//   const selectedCountry = form.watch('country');
//   // FETCH COUNTRY
//   const [countryOptions, setCountryOptions] = useState([])
//   const { data: getCountry } = useFetch('/api/master/location/country?deleteType=SD&&size=1000')

//   useEffect(() => {
//     if (getCountry && getCountry.success) {
//       const options = getCountry.data.map(coun => ({ label: coun.country, value: coun._id }))
//       setCountryOptions(options)
//     }
//   }, [getCountry])

//   // FETCH STATES
//   const [stateOptions, setStateOptions] = useState([])
//   const { data: getStateData } = useFetch('/api/master/location/state?deleteType=SD&&size=1000')
//   const [filteredStates, setFilteredStates] = useState([])
//   useEffect(() => {
//     if (getStateData && getStateData.success) {
//       const options = getStateData.data.map(sta => ({
//         label: sta.state,
//         value: sta._id,
//         countryId: sta.countryId,
//       }))
//       setStateOptions(options)
//     }
//   }, [getStateData])


//   // FILTER STATES BASED ON COUNTRY SELECTION
//   useEffect(() => {
//     if (selectedCountry) {
//       const filtered = stateOptions.filter(
//         state => state.countryId === selectedCountry
//       )
//       setFilteredStates(filtered)
//     } else {
//       setFilteredStates([])
//       form.setValue('state', '')
//     }
//   }, [selectedCountry, stateOptions])

//   // FETCH CITY
//   const selectedState = form.watch('state')
//   const [cityOptions, setCityOptions] = useState([])
//   const { data: getCityData } = useFetch('/api/master/location/city?deleteType=SD&&size=1000')
//   const [filteredCities, setFilteredCities] = useState([])
//   useEffect(() => {
//     if (getCityData && getCityData.success) {
//       const options = getCityData.data.map(cit => ({
//         label: cit.city,
//         value: cit._id,
//         stateId: cit.stateId
//       }))
//       setCityOptions(options)
//     }
//   }, [getCityData])

//   // FETCH CITY BASED ON STATE SELECTION
//   useEffect(() => {
//     if (selectedState) {
//       const filtered = cityOptions.filter(
//         city => city.stateId === selectedState
//       )
//       setFilteredCities(filtered)
//     } else {
//       setFilteredCities([])
//       form.setValue('city', '')
//     }
//   }, [selectedState, cityOptions])

//   //FETCH LOCALITIES
//   const selectedCity = form.watch('city')
//   const [localityOptions, setLocalityOptions] = useState([])
//   const { data: getLocalityData } = useFetch('/api/master/location/locality?deleteType=SD&&size=1000')
//   const [filteredLocalities, setFilteredLocalities] = useState([])
//   useEffect(() => {
//     if (getLocalityData && getLocalityData.success) {
//       const options = getLocalityData.data.map(loc => ({
//         label: loc.locality,
//         value: loc._id,
//         cityId: loc.cityId
//       }))
//       setLocalityOptions(options)
//     }
//   }, [getLocalityData])

//   // FETCH LOCALITY BASED ON CITY SELECTION
//   useEffect(() => {
//     if (selectedCity) {
//       const filtered = localityOptions.filter(
//         locality => locality.cityId === selectedCity
//       )
//       setFilteredLocalities(filtered)
//     } else {
//       setFilteredLocalities([])
//       form.setValue('locality', '')
//     }
//   }, [selectedCity, localityOptions])

//   //FETCH SUBLOCALITIES
//   const selectedLocality = form.watch('locality')
//   const [sublocalityOptions, setSublocalityOptions] = useState([])
//   const { data: getSublocalityData } = useFetch('/api/master/location/sublocality?deleteType=SD&&size=1000')
//   const [filteredSublocalities, setFilteredSublocalities] = useState([])
//   useEffect(() => {
//     if (getSublocalityData && getSublocalityData.success) {
//       const options = getSublocalityData.data.map(sub => ({
//         label: sub.sublocality,
//         value: sub._id,
//         localityId: sub.localityId
//       }))
//       setSublocalityOptions(options)
//     }
//   }, [getSublocalityData])

//   // FETCH SUBLOCALITY BASED ON LOCALITY SELECTION
//   useEffect(() => {
//     if (selectedLocality) {
//       const filtered = sublocalityOptions.filter(
//         sublocality => sublocality.localityId === selectedLocality
//       )
//       setFilteredSublocalities(filtered)
//     } else {
//       setFilteredSublocalities([])
//       form.setValue('sublocality', '')
//     }
//   }, [selectedLocality, sublocalityOptions])




//   // AUTO GENERATE SLUG
//   useEffect(() => {
//     const name = form.getValues('name')
//     if (name) {
//       form.setValue('slug', slugify(name).toLowerCase())
//     }
//   }, [form.watch('name')])



//   //CKEDITOR
//   const editor = (event, editor) => {
//     const data = editor.getData()
//     form.setValue('description', data)
//   }

//   // SUBMIT
//   const onSubmit = async (values) => {
//     if (selectedMedia.length <= 0) {
//       return showToast('error', 'Please Select Media')
//     }
//     const mediaIds = selectedMedia.map(media => media._id)
//     values.media = mediaIds

//     setLoading(true)
//     try {
//       const { data: response } = await axios.post('/api/provider/listing/create', values)
//       if (!response.success) {
//         throw new Error(response.message)
//       }
//       form.reset()
//       showToast('success', response.message)
//     } catch (error) {
//       showToast('error', error.message)
//     } finally {
//       setLoading(false)
//     }
//   }


//   return (
//     <div>
//       <BreadCrumb breadCrumbData={breadCrumbData} />

//       <Card className='py-0 rounded shadow-sm'>
//         <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
//           <h4 className='text-xl font-semibold'>Add Listing</h4>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className='grid md:grid-cols-2 grid-cols-1 gap-5'>
//               {/* LISTING NAME */}
//               <FormField control={form.control} name="name" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Listing Name<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Input type='text' placeholder='Enter listing name' {...field} />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* SLUG */}
//               <FormField control={form.control} name="slug" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Slug<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Input type='text' placeholder='Enter Slug' {...field} />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* CATEGORY */}
//               <FormField control={form.control} name="category" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Category<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={categoryOptions}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select Category'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* SUBCATEGORY */}
//               <FormField control={form.control} name="subcategory" render={({ field }) => (
//                 <FormItem >
//                   <FormLabel>Subcategory<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={filteredSubcategories}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select Subcategory'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* STARTING PRICE */}
//               <FormField control={form.control} name="startingPrice" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Starting Price<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Input type='number' placeholder='Enter Starting Price' {...field} />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* CAPACITY */}
//               <FormField control={form.control} name="capacity" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Capacity</FormLabel>
//                   <FormControl>
//                     <Input type='number' placeholder='Enter Capacity (optional)' {...field} />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* ADDRESS */}
//               <FormField control={form.control} name="address" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Input type='text' placeholder='Enter Address' {...field} />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* COUNTRY */}
//               <FormField control={form.control} name="country" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Country<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={countryOptions}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select Country'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* STATE */}
//               <FormField control={form.control} name="state" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>State<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={filteredStates}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select State'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* CITY */}
//               <FormField control={form.control} name="city" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>City<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={filteredCities}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select City'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* LOCALITY */}
//               <FormField control={form.control} name="locality" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Locality<span className='text-red-500'>*</span></FormLabel>
//                   <FormControl>
//                     <Select
//                       options={filteredLocalities}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select Locality'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* SUBLOCALITY */}
//               <FormField control={form.control} name="sublocality" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Sublocality</FormLabel>
//                   <FormControl>
//                     <Select
//                       options={filteredSublocalities}
//                       selected={field.value}
//                       setSelected={field.onChange}
//                       isMulti={false}
//                       placeholder='Select Sublocality (optional)'
//                     />
//                   </FormControl>
//                 </FormItem>
//               )} />

//               {/* DESCRIPTION */}
//               <div className='col-span-2'>
//                 <FormLabel className='mb-2'>Description <span className='text-red-500'>*</span></FormLabel>
//                 <Editor onChange={editor} />
//                 <FormMessage></FormMessage>
//               </div>

//               <div className='md:col-span-2 border border-dashed rounded p-5 text-center'>
//                 <MediaModal
//                   open={open}
//                   setOpen={setOpen}
//                   selectedMedia={selectedMedia}
//                   setSelectedMedia={setSelectedMedia}
//                   isMultiple={true}
//                 />
//                 {selectedMedia.length > 0
//                   &&
//                   <div className='flex justify-center items-center flex-wrap mb-3 gap-2 '>
//                     {selectedMedia.map(media => (
//                       <div className='h-24 w-24 border' key={media._id}>
//                         {<Image
//                           src={media.url}
//                           alt={media.alt || ''}
//                           width={300}
//                           height={300}
//                           className='size-full object-cover'
//                         />}
//                       </div>
//                     ))}
//                   </div>}
//                 <div className=' dark:bg-card border w-[200px] py-2 cursor-pointer mx-auto text-center mt-4 bg-primary rounded-md ' onClick={() => setOpen(true)}>
//                   <span className='font-semibold text-white'>Select Media</span>
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <div className='mb-3 col-span-2 text-end'>
//                 {/* <Button type='button' className='cursor-pointer mb-4 mr-4' onClick={() => setFields(false)}>Back</Button> */}
//                 <ButtonLoading loading={loading} type='submit' text='Add' />
//               </div>



//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default AddListing