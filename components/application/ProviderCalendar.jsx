'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Select from '@/components/application/Main/Select'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import Calendar from '@/components/application/Calendar'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'
import { Tag, Package, Calendar as CalendarIcon, Settings2, X, ArrowDown } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/application/ButtonLoading'
import { ArrowDropDownRounded, ArrowDropUpRounded } from '@mui/icons-material'
import { dateStatus } from '@/lib/utils'

const calendarFormSchema = z.object({
    listingId: z.string().min(1, 'Please select a listing'),
    variantId: z.string().optional(),
    dates: z.array(z.string()).min(1, 'Please select at least one date'),
    dateStatus: z.enum(dateStatus),
    price: z.number().min(0, 'Price cannot be negative').default(0),
})

const ProviderCalendar = ({ isPage = false }) => {
    const [selectedDates, setSelectedDates] = useState([])
    const [calendarData, setCalendarData] = useState({})
    const [availability, setAvailability] = useState({})
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(calendarFormSchema),
        defaultValues: {
            listingId: '',
            variantId: '',
            dates: [],
            dateStatus: 'available',
            price: 0
        },
    })

    const { data: listingsResponse } = useFetch('/api/provider/listing?deleteType=SD')
    const listingId = form.watch('listingId')
    const { data: variantsResponse } = useFetch(listingId ? `/api/provider/variants-by-listing?listingId=${listingId}` : null)

    const listingOptions = listingsResponse?.data?.map(l => ({ label: l.name, value: l._id })) || []
    const variantOptions = variantsResponse?.data?.length > 0
        ? variantsResponse.data.map(v => ({ label: v.title, value: v._id }))
        : []
    const hasVariants = variantsResponse?.data?.length > 0

    useEffect(() => {
        if (variantsResponse?.data && variantsResponse.data.length > 0) {
            form.setValue('variantId', variantsResponse.data[0]._id)
        } else {
            form.setValue('variantId', '')
        }
    }, [variantsResponse?.data, form])

    const statusOptions = dateStatus.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }))

    useEffect(() => {
        const variantId = form.watch('variantId')
        if (listingId) {
            setIsLoadingCalendar(true)
            let url = `/api/provider/calendar?listingId=${listingId}`
            if (variantId) url += `&variantId=${variantId}`

            axios.get(url)
                .then(({ data }) => {
                    if (data.success) {
                        const formattedData = {}
                        const cData = data.data.calendarData || []
                        const avail = data.data.availability || {}
                        setAvailability(avail)
                        
                        cData.forEach(item => {
                            const dateKey = new Date(item.date).toISOString().split('T')[0]
                            formattedData[dateKey] = {
                                status: item.dateStatus,
                                price: item.price,
                                name: item.name,
                                phone: item.phone,
                                bookingStatus: item.bookingStatus,
                                paymentStatus: item.paymentStatus
                            }
                        })

                        // Also inject permanent blocks based on availability rules
                        // We do this by checking days that aren't already in formattedData
                        // For the current view (roughly 3 months for safety)
                        const start = new Date()
                        start.setMonth(start.getMonth() - 1)
                        for (let i = 0; i < 180; i++) {
                            const d = new Date(start)
                            d.setDate(d.getDate() + i)
                            const dateKey = d.toISOString().split('T')[0]
                            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                            
                            if (avail[dayName] === false && !formattedData[dateKey]) {
                                formattedData[dateKey] = {
                                    status: 'blocked',
                                    price: 0
                                }
                            }
                        }

                        setCalendarData(formattedData)
                    }
                })
                .finally(() => setIsLoadingCalendar(false))
        } else {
            setCalendarData({})
        }
    }, [listingId, form.watch('variantId')])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const promises = values.dates.map(dateKey => {
                const payload = {
                    listingId: values.listingId,
                    variantId: values.variantId || null,
                    dateStatus: values.dateStatus,
                    price: values.price,
                    date: new Date(dateKey).toISOString()
                }
                return axios.post('/api/provider/calendar', payload)
            })

            await Promise.all(promises)

            const updatedData = { ...calendarData }
            values.dates.forEach(dk => {
                updatedData[dk] = { status: values.dateStatus, price: values.price }
            })
            setCalendarData(updatedData)

            showToast('success', 'Calendar updated successfully')
            setSelectedDates([])
            form.setValue('dates', [])
            setShowModal(false)
        } catch (error) {
            showToast('error', 'Failed to update calendar')
        } finally {
            setLoading(false)
        }
    }

    const [calendarOpen, setCalendarOpen] = useState(isPage)

    return (
        <Card className='rounded-sm border shadow-sm overflow-hidden bg-white mt-6 pb-0 dark:bg-gray-950'>
            <CardHeader className=''>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 '>
                    <div className='flex items-center justify-center gap-3'>
                        <div className='p-2 bg-primary/10 rounded-lg'>
                            <CalendarIcon className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                            <h2 className='md:text-xl text-lg font-bold text-gray-900 dark:text-white'>Availability Calendar</h2>
                        </div>
                    </div>
                    {selectedDates.length > 0 && (
                        <Button
                            onClick={() => setShowModal(true)}
                            size="md:sm text-xs"
                            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 py-3"
                        >
                            <Settings2 className="md:w-4 w-3 md:h-4 h-3" />
                            Update {selectedDates.length} Selected
                        </Button>
                    )}
                    {!isPage && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setCalendarOpen(o => !o)}
                            className="flex items-center gap-2"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            {calendarOpen ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
                        </Button>
                    )}
                </div>

                <div
                    style={{
                        maxHeight: calendarOpen ? '300px' : '0px',
                        opacity: calendarOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.35s ease, opacity 0.3s ease',
                    }}
                >
                    <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                                <Tag className='w-3 h-3' /> Select Listing
                            </label>
                            <Select
                                options={listingOptions}
                                selected={listingId}
                                setSelected={(val) => {
                                    form.setValue('listingId', val)
                                    form.setValue('variantId', '')
                                }}
                                placeholder="All Listings"
                                className="bg-white dark:bg-gray-900"
                            />
                        </div>
                        {hasVariants && (
                            <div className='space-y-2'>
                                <label className='text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                                    <Package className='w-3 h-3' /> Select Variant
                                </label>
                                <Select
                                    options={variantOptions}
                                    selected={form.watch('variantId')}
                                    setSelected={(val) => form.setValue('variantId', val)}
                                    placeholder="Select Variant"
                                    className="bg-white dark:bg-gray-900"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <div
                style={{
                    maxHeight: calendarOpen ? '800px' : '0px',
                    opacity: calendarOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.35s ease',
                }}
            >
                <CardContent className='p-0'>
                    <Calendar
                        mode="select"
                        selectedDates={selectedDates}
                        onDateSelect={(dates) => {
                            setSelectedDates(dates)
                            form.setValue('dates', dates)
                        }}
                        calendarData={calendarData}
                        isLoading={isLoadingCalendar}
                        className="border-0 my-0 rounded-none shadow-none"
                        showLegend={true}
                        lockedStatuses={['booked']}
                    />
                </CardContent>
            </div>

            {
                showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <Card className="max-w-md w-full shadow-2xl border-0 overflow-hidden bg-white dark:bg-gray-900 animate-in zoom-in-95 duration-200">
                            <CardHeader className="bg-primary/5 p-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Settings2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg dark:text-white">Batch Update</h3>
                                            <p className="text-xs text-gray-500">{selectedDates.length} dates selected</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="dateStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Status</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            options={statusOptions}
                                                            selected={field.value}
                                                            setSelected={field.onChange}
                                                            popoverContentClassName="!z-[110]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Price (PKR)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={e => field.onChange(Number(e.target.value))}
                                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 rounded-xl"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <ButtonLoading
                                                loading={loading}
                                                text="Save Changes"
                                                type="submit"
                                                className="flex-1 rounded-xl bg-primary text-white"
                                            />
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </Card >
    )
}

export default ProviderCalendar
