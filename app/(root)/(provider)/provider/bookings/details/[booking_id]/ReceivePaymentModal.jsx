'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import ButtonLoading from '@/components/application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

export default function ReceivePaymentModal({ booking, onSuccess, openExternal, setOpenExternal }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const open = openExternal !== undefined ? openExternal : internalOpen
  const setOpen = setOpenExternal !== undefined ? setOpenExternal : setInternalOpen

  const totalCharges = booking?.totalAmount || 0
  const alreadyReceived = booking?.receivedAmount || booking?.advance || 0
  const remaining = totalCharges - alreadyReceived

  const receivePaymentSchema = z.object({
    amount: z.coerce.number()
      .min(1, 'Amount must be greater than 0')
      .max(remaining > 0 ? remaining : 999999, `Maximum amount is ${remaining}`),
    paymentMethod: z.string().min(1, 'Payment Method is required'),
    note: z.string().optional()
  })

  const form = useForm({
    resolver: zodResolver(receivePaymentSchema),
    defaultValues: {
      amount: remaining > 0 ? remaining : 0,
      paymentMethod: 'Cash',
      note: ''
    }
  })

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const payload = {
        bookingId: booking._id,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        note: values.note,
      }

      const { data } = await axios.post('/api/provider/bookings/receive-payment', payload)
      if (data.success) {
        showToast('success', data.message || 'Payment received successfully')
        setOpen(false)
        form.reset()
        if (onSuccess) onSuccess()
      } else {
        showToast('error', data.message)
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to receive payment')
    } finally {
      setLoading(false)
    }
  }

  // If there's no remaining amount, we can disable the button or show a message
  const fullyPaid = remaining <= 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={fullyPaid}>Receive Payment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Payment</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md space-y-2 mb-4 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Charges</span>
            <span className="font-semibold">{totalCharges.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Already Received</span>
            <span className="font-semibold text-green-600">{alreadyReceived.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Remaining</span>
            <span className="text-red-600">{remaining.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
          </div>
        </div>

        {fullyPaid ? (
          <div className="text-center text-green-600 font-semibold py-4">
            Payment has been fully received.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField control={form.control} name='amount' render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Receiving (Max {remaining.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='paymentMethod' render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='note' render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Payment note..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end gap-3 mt-6 pt-2">
                 <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                 <ButtonLoading type="submit" loading={loading} text="Confirm Payment" disabled={fullyPaid} />
              </div>

            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
