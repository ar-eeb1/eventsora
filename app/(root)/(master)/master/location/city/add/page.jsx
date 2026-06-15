'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MASTER_CITY_SHOW, MASTER_DASHBOARD, MASTER_STATE_SHOW } from '@/routes/MasterPanelRoute'
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
  { href: MASTER_CITY_SHOW, label: 'Cities' },
  { href: '', label: 'Add City' },
]

const AddCity = () => {
  const [states, setStates] = useState([])
  const [selectedStates, setSelectedStates] = useState('')
  const [loadingStates, setloadingStates] = useState(false)
  const [loading, setLoading] = useState(false)

  //fetch states
  useEffect(() => {
    const fetchStates = async () => {
      setloadingStates(true)
      try {
        const { data: response } = await axios.get('/api/master/location/state', {
          params: { start: 0, size: 100, deleteType: 'SD' }
        })
        setStates(response.data)
      } catch (error) {
        showToast('error', error.message)
      } finally {
        setloadingStates(false)
      }
    }

    fetchStates()
  }, [])



  const formSchema = zSchema.pick({
    state: true,
    city: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: selectedStates,
      city: '',
    }
  })


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/master/location/city/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset({
        state: form.getValues('state'),
        city: '',
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
          <h4 className='text-xl font-semibold'>Add City</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedStates(value)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingStates ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : states.length === 0 ? (
                            <SelectItem value='loading' disable>
                              No State Found
                            </SelectItem>
                          ) : (
                            states.map(cat => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.state}
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Enter City' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type='submit' text='Add City' className='' />
              </div>
            </form>

          </Form>
        </CardContent>
      </Card >
    </div >
  )
}

export default AddCity
