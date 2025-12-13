'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD, MASTER_LOCALITY_SHOW } from '@/routes/MasterPanelRoute'
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
  { href: MASTER_LOCALITY_SHOW, label: 'Localities' },
  { href: '', label: 'Add Locality' },
]

const AddLocality = () => {
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [loadingCities, setloadingCities] = useState(false)
  const [loading, setLoading] = useState(false)

  //fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setloadingCities(true)
      try {
        const { data: response } = await axios.get('/api/master/location/city', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setCities(response.data)
      } catch (error) {
        showToast('error', error.message)
      } finally {
        setloadingCities(false)
      }
    }

    fetchCities()
  }, [])


  const formSchema = zSchema.pick({
    city: true,
    locality: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: selectedCity,
      locality: '',
    }
  })


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/master/location/locality/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset({
        city: form.getValues('city'),
        locality: '',
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
          <h4 className='text-xl font-semibold'>Add Locality</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select City</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCity(value)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCities ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : cities.length === 0 ? (
                            <SelectItem value='loading' disable>
                              No City Found
                            </SelectItem>
                          ) : (
                            cities.map(cat => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.city}
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
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locality</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter Locality' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type='submit' text='Add Locality' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card >
    </div >
  )
}

export default AddLocality
