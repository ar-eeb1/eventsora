'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import ButtonLoading from '@/components/application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import { z } from 'zod'

const manualBookingSchema = z.object({
  name: z.string().min(1, 'Client Name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone is required'),
  eventType: z.string().min(1, 'Event Type is required'),
  bookingDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time Slot is required'),
  guestCount: z.coerce.number().min(1, 'Guest Count is required'),
  totalAmount: z.coerce.number().min(1, 'Total Charges required'),
  advance: z.coerce.number().min(0, 'Advance must be >= 0'),
  paymentMethod: z.string().min(1, 'Payment Method is required'),
  bookingStatus: z.string().min(1, 'Booking Status is required'),
  listingId: z.string().min(1, 'Select a Listing'),
  variantId: z.string().optional()
})

export default function ManualBookingModal({ onSuccess, children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [variants, setVariants] = useState([])

  const { data: listingsData } = useFetch('/api/provider/listing?deleteType=SD&&size=10000')
  const { data: variantsData } = useFetch('/api/provider/listing-variant?deleteType=SD&&size=10000')


  const form = useForm({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: '',
      bookingDate: '',
      timeSlot: '',
      guestCount: '',
      totalAmount: '',
      advance: '',
      paymentMethod: 'Cash',
      bookingStatus: 'confirmed',
      listingId: '',
      variantId: ''
    }
  })

  const selectedListingId = form.watch('listingId');
  useEffect(() => {
    if (selectedListingId && variantsData?.data) {
      // listingId might be populated as an object in variants if it's aggregated, but usually it's a string ID.
      // E.g. v.listingId === selectedListingId or v.listingId._id === selectedListingId
      const filteredVariants = variantsData.data.filter(v => {
        const vListId = typeof v.listingId === 'object' ? v.listingId?._id : v.listingId;
        return vListId === selectedListingId;
      });
      setVariants(filteredVariants);
    } else {
      setVariants([]);
    }
  }, [selectedListingId, variantsData])


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      // Find the selected listing data to send minimal required fields
      let selectedListing = listingsData?.data?.find(l => l._id === values.listingId);

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        eventType: values.eventType,
        timeSlot: values.timeSlot,
        guestCount: values.guestCount,
        totalAmount: values.totalAmount,
        advance: values.advance,
        paymentMethod: values.paymentMethod,
        bookingStatus: values.bookingStatus,
        bookingSource: 'manual',
        listings: [{
          listingId: values.listingId,
          variantId: values.variantId || null,
          name: selectedListing?.title || selectedListing?.name || 'Manual Booking',
          variantTitle: variants.find(v => v._id === values.variantId)?.name || variants.find(v => v._id === values.variantId)?.title || null,
          slug: selectedListing?.slug || 'manual',
          price: values.totalAmount,
          quantity: 1, // default
          bookingDate: [values.bookingDate]
        }]
      }

      const { data } = await axios.post('/api/provider/bookings/manual', payload)
      if (data.success) {
        showToast('success', data.message || 'Manual booking created successfully')
        setOpen(false)
        form.reset()
        if (onSuccess) onSuccess()
      } else {
        showToast('error', data.message)
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} className=''>
      <DialogTrigger asChild>
        {children || <Button>New Booking</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Booking</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">

            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem><FormLabel>Client Name</FormLabel><FormControl>
                <Input {...field} placeholder="Client Name" />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='email' render={({ field }) => (
              <FormItem><FormLabel>Client Email</FormLabel><FormControl>
                <Input type="email" {...field} placeholder="Client Email" />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='phone' render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl>
                <Input {...field} placeholder="Phone" />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='eventType' render={({ field }) => (
              <FormItem><FormLabel>Event Type</FormLabel><FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select Event Type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Party">Party</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='bookingDate' render={({ field }) => (
              <FormItem><FormLabel>Booking Date</FormLabel><FormControl>
                <Input type="date" {...field} />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='timeSlot' render={({ field }) => (
              <FormItem><FormLabel>Time Slot / Custom Time</FormLabel><FormControl>
                <Input {...field} placeholder="e.g. 10:00 AM - 02:00 PM" />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='guestCount' render={({ field }) => (
              <FormItem><FormLabel>Guest Count</FormLabel><FormControl>
                <Input type="number" {...field} />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='listingId' render={({ field }) => (
              <FormItem>
                <FormLabel>Select Listing</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Listing" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {listingsData?.data?.map(list => (
                        <SelectItem key={list._id} value={list._id}>{list.name || list.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {variants.length > 0 && (
              <FormField control={form.control} name='variantId' render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Variant</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Variant" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {variants.map(v => (
                          <SelectItem key={v._id} value={v._id}>{v.name || v.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <FormField control={form.control} name='totalAmount' render={({ field }) => (
              <FormItem><FormLabel>Total Charges</FormLabel><FormControl>
                <Input type="number" {...field} />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='advance' render={({ field }) => (
              <FormItem><FormLabel>Advance Received</FormLabel><FormControl>
                <Input type="number" {...field} />
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='paymentMethod' render={({ field }) => (
              <FormItem><FormLabel>Payment Method</FormLabel><FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name='bookingStatus' render={({ field }) => (
              <FormItem><FormLabel>Booking Status</FormLabel><FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Booking Status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="awaiting-payment">Awaiting Payment</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl><FormMessage /></FormItem>
            )} />

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <ButtonLoading type="submit" loading={loading} text="Create Booking" />
            </div>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
