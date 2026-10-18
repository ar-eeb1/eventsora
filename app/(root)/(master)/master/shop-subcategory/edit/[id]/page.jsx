'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD, MASTER_SHOP_SUB_CATEGORY_SHOW } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import slugify from 'slugify'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const breadCrumbData = [
  { href: MASTER_DASHBOARD, label: 'Dashboard' },
  { href: MASTER_SHOP_SUB_CATEGORY_SHOW, label: 'Shop Sub Categories' },
  { href: '', label: 'Edit Shop Sub Category' },
]

const EditShopSubcategory = () => {
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const formSchema = zSchema.pick({
    category: true,
    subcategory: true,
    slug: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      subcategory: '',
      slug: '',
    }
  })

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const { data: response } = await axios.get('/api/master/shop-category', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setCategories(response.data || [])
      } catch (error) {
        showToast('error', error?.response?.data?.message || error.message)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`/api/master/shop-subcategory/get/${id}`)
        if (response.success) {
          const data = response.data
          form.reset({
            category: data?.shopCategory || '',
            subcategory: data?.shopSubCategory || '',
            slug: data?.slug || '',
          })
        } else {
          showToast('error', response.message)
        }
      } catch (error) {
        showToast('error', error?.response?.data?.message || error.message)
      } finally {
        setFetching(false)
      }
    }

    if (id) fetchData()
  }, [id, form])

  const subcategoryValue = form.watch('subcategory')

  useEffect(() => {
    const name = subcategoryValue
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [subcategoryValue, form])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.put('/api/master/shop-subcategory/update', {
        ...values,
        _id: id,
      })

      if (!response.success) {
        throw new Error(response.message)
      }
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=''>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Edit Shop Sub Category</h4>
        </CardHeader>

        <CardContent>
          {fetching ? (
            <p className='text-sm text-muted-foreground py-4'>Loading...</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Shop Category</FormLabel>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Shop Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingCategories ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : categories.length === 0 ? (
                              <SelectItem value='loading' disabled>
                                No Shop Category Found
                              </SelectItem>
                            ) : (
                              categories.map(cat => (
                                <SelectItem key={cat._id} value={cat._id}>
                                  {cat.category}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='my-4'>
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Sub Category</FormLabel>
                        <FormControl>
                          <Input type='text' placeholder='Enter Shop Sub Category' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='my-4'>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input type='text' placeholder='Enter Slug' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <ButtonLoading loading={loading} type='submit' text='Update Shop Sub Category' className='' />
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EditShopSubcategory
