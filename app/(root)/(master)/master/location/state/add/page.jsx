'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD, MASTER_STATE_SHOW } from '@/routes/MasterPanelRoute'
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

const breadCrumbData = [
  { href: MASTER_DASHBOARD, label: 'Dashboard' },
  { href: MASTER_STATE_SHOW, label: 'States' },
  { href: '', label: 'Add State' },
]

const AddState = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [loadingCountries, setloadingCountries] = useState(false)
  const [loading, setLoading] = useState(false)

  //fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setloadingCountries(true)
      try {
        const { data: response } = await axios.get('/api/master/location/country', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setCountries(response.data)
      } catch (error) {
        showToast('error', error.message)
      } finally {
        setloadingCountries(false)
      }
    }

    fetchCountries()
  }, [])



  const formSchema = zSchema.pick({
    country: true,
    state: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: selectedCountry,
      state: '',
    }
  })


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/master/location/state/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset({
        country: form.getValues('country'),
        state: '',
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
          <h4 className='text-xl font-semibold'>Add State</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCountry(value)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCountries ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : countries.length === 0 ? (
                            <SelectItem value='loading' disable>
                              No Country Found
                            </SelectItem>
                          ) : (
                            countries.map(cat => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.country}
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter State' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type='submit' text='Add State' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card >
    </div >
  )
}

export default AddState
