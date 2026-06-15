'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_CATEGORY_SHOW, MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import slugify from 'slugify'

const breadCrumbData = [
  { href: MASTER_DASHBOARD, label: 'Dashboard' },
  { href: MASTER_CATEGORY_SHOW, label: 'Categories' },
  { href: '', label: 'Add Category' },
]

const AddSubcategory = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loadingCategories, setloadingCategories] = useState(false)
  const [loading, setLoading] = useState(false)

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setloadingCategories(true)
      try {
        const { data: response } = await axios.get('/api/master/category', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setCategories(response.data)
      } catch (error) {
        showToast('error', error.message)
      } finally {
        setloadingCategories(false)
      }
    }

    fetchCategories()
  }, [])



  const formSchema = zSchema.pick({
    category: true,
    subcategory: true,
    slug: true,

  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: selectedCategory,
      subcategory: '',
      slug: '',
    }
  })

  useEffect(() => {
    const name = form.getValues('subcategory')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('subcategory')])


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/master/subcategory/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset({
        subcategory: '',
        slug: '',
        category: form.getValues('category')
      })
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=''>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Add Sub Category</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCategory(value)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCategories ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value='loading' disable>
                              No Category Found
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
                >
                </FormField>

              </div>
              <div className='my-4'>
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter sub-Category' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
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
                >
                </FormField>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type='submit' text='Add Sub Category' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card >
    </div >
  )
}

export default AddSubcategory
