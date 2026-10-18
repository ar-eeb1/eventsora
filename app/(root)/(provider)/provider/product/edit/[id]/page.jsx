'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import Editor from '@/components/application/Provider/Editor'
import MediaModal from '@/components/application/Provider/MediaModal'
import UploadMedia from '@/components/application/Provider/UploadMedia'
import Select from '@/components/application/Main/Select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { productFormSchema } from '@/lib/zodSchema'
import { PROVIDER_DASHBOARD, PROVIDER_PRODUCT_SHOW } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { Images, X } from 'lucide-react'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_PRODUCT_SHOW, label: 'Products' },
  { href: '', label: 'Edit Product' },
]

const EditProduct = () => {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedMedia, setSelectedMedia] = useState([])
  const [openMediaModal, setOpenMediaModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: '', slug: '', category: '', subcategory: '', price: 0, sku: '', discountPercentage: 0, stockType: 'in_stock', stockQuantity: 0, minimumOrderQuantity: 1, processingValue: 0, processingUnit: 'days', customizable: false, description: '', country: '', state: '', city: '', tags: '', inquirePrice: false },
  })

  const category = form.watch('category')
  const country = form.watch('country')
  const state = form.watch('state')
  const productName = form.watch('name')
  const stockType = form.watch('stockType')
  const { data: countryData } = useFetch('/api/master/location/country?deleteType=SD&&size=1000')
  const { data: stateData } = useFetch('/api/master/location/state?deleteType=SD&&size=1000')
  const { data: cityData } = useFetch('/api/master/location/city?deleteType=SD&&size=1000')

  useEffect(() => {
    if (stockType === 'made_to_order') {
      form.setValue('stockQuantity', 0, { shouldValidate: true })
    }
  }, [stockType, form])

  useEffect(() => {
    axios.get('/api/provider/shop-category').then(({ data }) => setCategories(Array.isArray(data.data) ? data.data : [])).catch((error) => showToast('error', error.response?.data?.message || error.message))
  }, [])

  useEffect(() => {
    if (!category) { setSubcategories([]); return }
    axios.get(`/api/provider/shop-subcategory?categoryId=${category}`).then(({ data }) => setSubcategories(Array.isArray(data.data) ? data.data : [])).catch((error) => showToast('error', error.response?.data?.message || error.message))
  }, [category])

  useEffect(() => {
    if (productName && !loadingProduct) form.setValue('slug', slugify(productName).toLowerCase())
  }, [productName, loadingProduct, form])

  useEffect(() => {
    if (!id) return
    axios.get(`/api/provider/product/get/${id}`).then(({ data }) => {
      if (!data.success) throw new Error(data.message)
      const product = data.data
      form.reset({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category?._id || product.category || '',
        subcategory: product.subcategory?._id || product.subcategory || '',
        price: product.price || 0,
        sku: product.sku || '',
        discountPercentage: product.discountPercentage || 0,
        stockType: product.stockType || 'in_stock',
        stockQuantity: product.stockQuantity || 0,
        minimumOrderQuantity: product.minimumOrderQuantity || 1,
        processingValue: product.processingTime?.value || 0,
        processingUnit: product.processingTime?.unit || 'days',
        customizable: !!product.customizable,
        description: product.description || '',
        country: product.country?._id || product.country || '',
        state: product.state?._id || product.state || '',
        city: product.city?._id || product.city || '',
        tags: (product.tags || []).join(', '),
        inquirePrice: !!product.inquirePrice,
      })

      setSelectedMedia((product.media || []).map((media) => ({ _id: media._id, url: media.secure_url || media.url })))
    }).catch((error) => showToast('error', error.response?.data?.message || error.message)).finally(() => setLoadingProduct(false))
  }, [id, form])

  const options = (data, label) => (data?.success ? data.data : []).map((item) => ({ label: item[label], value: item._id }))
  const countryOptions = options(countryData, 'country')
  const stateOptions = options(stateData, 'state').filter((item) => stateData?.data?.find((entry) => entry._id === item.value)?.countryId === country)
  const cityOptions = options(cityData, 'city').filter((item) => cityData?.data?.find((entry) => entry._id === item.value)?.stateId === state)

  const onSubmit = async (values) => {
    if (!selectedMedia.length) return showToast('error', 'Please select at least one product image')
    setLoading(true)
    try {
      const payload = { _id: id, ...values, stockQuantity: values.stockType === 'in_stock' ? values.stockQuantity : 0, media: selectedMedia.map((media) => media._id), tags: values.tags ? values.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [], processingTime: { value: values.processingValue, unit: values.processingUnit } }
      delete payload.processingValue
      delete payload.processingUnit
      const { data } = await axios.put('/api/provider/product/update', payload)
      if (!data.success) throw new Error(data.message)
      queryClient.invalidateQueries({ queryKey: ['product-data'] })
      showToast('success', data.message)
      router.push(PROVIDER_PRODUCT_SHOW)
    } catch (error) { showToast('error', error.response?.data?.message || error.message) } finally { setLoading(false) }
  }

  const renderSelect = (name, label, optionsList, placeholder) => <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Select options={optionsList} selected={field.value} setSelected={field.onChange} isMulti={false} placeholder={placeholder} /></FormControl><FormMessage /></FormItem>} />
  const textField = (name, label, props = {}) => <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...props} {...field} /></FormControl><FormMessage /></FormItem>} />

  if (loadingProduct) return <div className="p-6">Loading product...</div>

  return (
    <div className="mx-auto w-[calc(100%-1%)]">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="overflow-hidden rounded-xl border-0 shadow-lg">
        <CardHeader className="border-b px-3 [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Product</h4>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section className="space-y-6">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">
                  Basic Information
                </h5>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {textField("name", "Product Name", {
                    placeholder: "Enter product name",
                  })}

                  {textField("slug", "Slug", {
                    disabled: true,
                    className: "bg-gray-50",
                  })}

                  {renderSelect(
                    "category",
                    "Shop Category",
                    categories.map((item) => ({
                      label: item.category,
                      value: item._id,
                    })),
                    "Select category"
                  )}

                  {renderSelect(
                    "subcategory",
                    "Shop Subcategory",
                    subcategories.map((item) => ({
                      label: item.shopSubCategory,
                      value: item._id,
                    })),
                    "Select subcategory"
                  )}

                  {textField("sku", "SKU", {
                    placeholder: "e.g. PROD-001",
                  })}

                  {textField("price", "Price", {
                    type: "number",
                    min: 0,
                  })}

                  {textField("discountPercentage", "Discount Percentage", {
                    type: "number",
                    min: 0,
                    max: 100,
                  })}

                  {renderSelect(
                    "stockType",
                    "Stock Type",
                    [
                      { label: "In Stock", value: "in_stock" },
                      { label: "Made to Order", value: "made_to_order" },
                    ],
                    "Select stock type"
                  )}

                  {stockType === 'in_stock' && textField('stockQuantity', 'Stock Quantity', {
                    type: 'number',
                    min: 0,
                    step: 1,
                  })}

                  {textField('minimumOrderQuantity', 'Minimum Order Quantity', {
                    type: 'number',
                    min: 1,
                    step: 1,
                  })}

                  {textField("processingValue", "Processing Time", {
                    type: "number",
                    min: 0,
                  })}

                  {renderSelect(
                    "processingUnit",
                    "Processing Unit",
                    [
                      { label: "Hours", value: "hours" },
                      { label: "Days", value: "days" },
                    ],
                    "Select unit"
                  )}

                  {textField("tags", "Tags", {
                    placeholder: "wedding, decor, handmade",
                  })}

                  <FormField
                    control={form.control}
                    name="customizable"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div className="space-y-1">
                          <FormLabel>Customizable Product</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Allow customers to request changes.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inquirePrice"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div className="space-y-1">
                          <FormLabel>Inquire Price</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Ask customers to contact you for pricing.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

              </section>
              <section className="space-y-6">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">Location Information</h5>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {renderSelect('country', 'Country', countryOptions, 'Select country')}{renderSelect('state', 'State', stateOptions, 'Select state')}{renderSelect('city', 'City', cityOptions, 'Select city')}
                </div>
              </section>
              <section className="space-y-4">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">Description</h5>
                <FormField control={form.control} name="description" render={() =>
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="overflow-hidden rounded-lg border">
                        <Editor onChange={(event, editor) => form.setValue('description', editor.getData(), { shouldValidate: true })} /></div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />
              </section>

              <section className="space-y-4">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">Media Gallery</h5>
                <div className="rounded-xl border-2 border-dashed p-8 text-center">
                  {
                    selectedMedia.length > 0
                    &&
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-6">
                      {selectedMedia.map((media) =>
                        <div key={media._id} className="group relative aspect-square overflow-hidden rounded-lg">
                          <Image src={media.url} alt="Product" fill className="object-cover" />
                          <button type="button" onClick={() => setSelectedMedia((prev) => prev.filter((item) => item._id !== media._id))} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                      }
                    </div>
                  }
                  <div className="flex flex-wrap justify-center gap-4">
                    <UploadMedia isMultiple queryClient={queryClient} onUploadSuccess={(media) =>
                      setSelectedMedia((prev) => [...prev, ...media.map((item) => ({ _id: item._id, url: item.secure_url }))])} />
                    <Button type="button" variant="outline" onClick={() => setOpenMediaModal(true)}>
                      <Images className="mr-2 h-4 w-4" />
                      Select from Gallery
                    </Button>
                  </div>
                  <MediaModal open={openMediaModal} setOpen={setOpenMediaModal} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} isMultiple />
                </div>
              </section>

              <div className="flex justify-end border-t pt-6"><ButtonLoading loading={loading} type="submit" text="Update Product" className="h-12 px-8" /></div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProduct
