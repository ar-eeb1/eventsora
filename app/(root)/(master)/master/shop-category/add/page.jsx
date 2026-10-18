'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD, MASTER_SHOP_CATEGORY_SHOW } from '@/routes/MasterPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'

const breadCrumbData = [
  { href: MASTER_DASHBOARD, label: 'Dashboard' },
  { href: MASTER_SHOP_CATEGORY_SHOW, label: 'Shop Categories' },
  { href: '', label: 'Add Category' },
]

const AddShopCategory = () => {
  const [loading, setLoading] = useState(false)
  const formSchema = zSchema.pick({
    category: true,
    slug: true,

  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      slug: ''
    }
  })

  useEffect(() => {
    const name = form.getValues('category')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('category')])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post(`/api/master/shop-category/create`, values, { withCredentials: true })

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
    <div className=''>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Add category in shop</h4>
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
                      <FormLabel>Shop Category</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter Title' {...field} />
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
                <ButtonLoading loading={loading} type='submit' text='Add Shop Category ' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddShopCategory
