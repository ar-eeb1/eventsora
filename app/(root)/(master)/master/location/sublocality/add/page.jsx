'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_DASHBOARD, MASTER_SUBLOCALITY_SHOW } from '@/routes/MasterPanelRoute'
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
  { href: MASTER_SUBLOCALITY_SHOW, label: 'Sublocalities' },
  { href: '', label: 'Add Sublocality' },
]

const AddSublocality = () => {
  const [localities, setLocalities] = useState([])
  const [selectedLocality, setSelectedLocality] = useState('')
  const [loadingLocalities, setloadingLocalities] = useState(false)
  const [loading, setLoading] = useState(false)

  //fetch locality
  useEffect(() => {
    const fetchLocalities = async () => {
      setloadingLocalities(true)
      try {
        const { data: response } = await axios.get('/api/master/location/locality', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setLocalities(response.data)
      } catch (error) {
        showToast('error', error.message)
      } finally {
        setloadingLocalities(false)
      }
    }

    fetchLocalities()
  }, [])


  const formSchema = zSchema.pick({
    locality: true,
    sublocality: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locality: selectedLocality,
      sublocality: '',
    }
  })


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/master/location/sublocality/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      // form.reset({
      //   locality: form.getValues('locality'),
      //   sublocality: '',
      // })
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
          <h4 className='text-xl font-semibold'>Add Sublocality</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Locality</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedLocality(value)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Locality" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingLocalities ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : localities.length === 0 ? (
                            <SelectItem value='loading' disable>
                              No locality Found
                            </SelectItem>
                          ) : (
                            localities.map(cat => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.locality}
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
                  name="sublocality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sublocality</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter Sublocality' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type='submit' text='Add Sublocality' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card >
    </div >
  )
}

export default AddSublocality
