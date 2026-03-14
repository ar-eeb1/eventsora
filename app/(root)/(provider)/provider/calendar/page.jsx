'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import Select from '@/components/application/Main/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_CALENDAR } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { dateStatus } from '@/lib/utils'
import axios from 'axios'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Check, Clock, Ban, Tag, Package, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Money } from '@mui/icons-material'
import { toPng } from 'html-to-image'

const breadcrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Home' },
    { href: PROVIDER_LISTING_CALENDAR, label: 'Calendar' },
]

// Zod schema for form validation
const calendarFormSchema = z.object({
    listingId: z.string().min(1, 'Please select a listing'),
    variantId: z.string().optional(),
    dates: z.array(z.string()).min(1, 'Please select at least one date'),
    dateStatus: z.enum(dateStatus),
    price: z.number().min(0, 'Price cannot be negative').default(0),
})

const ListingCalendar = () => {
    const [loading, setLoading] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDates, setSelectedDates] = useState([])
    const [calendarData, setCalendarData] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    // Initialize form
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

    // Get listings using useFetch
    const { data: getListing } = useFetch('/api/provider/listing?deleteType=SD')

    const [listingOptions, setListingOptions] = useState([])

    useEffect(() => {
        if (getListing?.success) {
            setListingOptions(
                getListing.data.map(list => ({
                    label: list.name,
                    value: list._id,
                }))
            )
        }
    }, [getListing])

    // Update your useFetch for variants to conditionally fetch based on listing
    const { data: getListingVariant } = useFetch(
        form.watch('listingId')
            ? `/api/provider/variants-by-listing?listingId=${form.watch('listingId')}`
            : null // Don't fetch if no listing is selected
    )

    const [listingVariantOptions, setListingVariantOptions] = useState([])
    const [hasVariants, setHasVariants] = useState(false)

    useEffect(() => {
        if (getListingVariant?.success && getListingVariant.data) {
            // Check if the listing has any variants
            if (Array.isArray(getListingVariant.data) && getListingVariant.data.length > 0) {
                setHasVariants(true)
                setListingVariantOptions(
                    getListingVariant.data.map(variant => ({
                        label: variant.title,
                        value: variant._id,
                        listingId: variant.listingId
                    }))
                )
            } else {
                setHasVariants(false)
                setListingVariantOptions([])
            }
        } else {
            setHasVariants(false)
            setListingVariantOptions([])
        }
    }, [getListingVariant])

    // Status options from dateStatus
    const statusOptions = dateStatus.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }))

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const formatDateKey = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const handleDateClick = (dateKey, day) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

        if (clickedDate < today) return // Disable past dates

        if (selectedDates.includes(dateKey)) {
            const newDates = selectedDates.filter(d => d !== dateKey)
            setSelectedDates(newDates)
            form.setValue('dates', newDates)
        } else {
            const newDates = [...selectedDates, dateKey]
            setSelectedDates(newDates)
            form.setValue('dates', newDates)
        }
    }

    const openModal = () => {
        if (selectedDates.length === 0) {
            showToast('error', 'Please select at least one date')
            return
        }

        if (!form.getValues('listingId')) {
            showToast('error', 'Please select a listing')
            return
        }

        // If listing has variants but no variant is selected, show error
        if (hasVariants && !form.getValues('variantId')) {
            showToast('error', 'Please select a variant or choose "Main Listing"')
            return
        }

        setShowModal(true)
    }

    const onSubmit = async (values) => {
        // Validate the form
        const isValid = await form.trigger()
        if (!isValid) {
            console.log('Form validation failed:', form.formState.errors)
            return
        }

        setLoading(true)
        try {
            // Prepare payload
            const payload = {
                listingId: values.listingId,
                dateStatus: values.dateStatus,
                price: values.price
            }

            // Add variantId if it exists
            if (values.variantId) {
                payload.variantId = values.variantId
            }

            // Submit each selected date to the API
            const promises = values.dates.map(dateKey => {
                const datePayload = {
                    ...payload,
                    date: new Date(dateKey).toISOString()
                }

                return axios.post('/api/provider/calendar', datePayload)
            })

            const results = await Promise.all(promises)

            // Check if all requests were successful
            const allSuccess = results.every(result => result.data.success)

            if (!allSuccess) {
                throw new Error('Some dates failed to save')
            }

            // Update local calendar data
            const updatedCalendarData = { ...calendarData }
            values.dates.forEach(dateKey => {
                updatedCalendarData[dateKey] = {
                    status: values.dateStatus,
                    price: values.price,
                    variantId: values.variantId
                }
            })
            setCalendarData(updatedCalendarData)

            showToast('success', 'Dates saved successfully')

            // Reset form and selections (keep listing and variant if selected)
            form.reset({
                listingId: values.listingId,
                variantId: values.variantId || '',
                dates: [],
                dateStatus: 'available',
                price: 0
            })
            setSelectedDates([])
            setShowModal(false)
        } catch (error) {
            console.error('API error:', error)
            showToast('error', error.response?.data?.message || error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Fetch existing calendar data when listing OR variant is selected
    useEffect(() => {
        const listingId = form.watch('listingId')
        const variantId = form.watch('variantId')

        if (listingId) {
            setIsLoadingCalendar(true)
            let url = `/api/provider/calendar?listingId=${listingId}`

            // Add variantId to query if it exists
            if (variantId) {
                url += `&variantId=${variantId}`
            }

            axios.get(url)
                .then(({ data }) => {
                    if (data.success) {
                        // Transform API data to calendar format
                        const formattedData = {}
                        if (Array.isArray(data.data)) {
                            data.data.forEach(item => {
                                const dateKey = new Date(item.date).toISOString().split('T')[0]
                                formattedData[dateKey] = {
                                    status: item.dateStatus,
                                    price: item.price
                                }
                            })
                        }
                        setCalendarData(formattedData)
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch calendar data:', error)
                })
                .finally(() => {
                    setIsLoadingCalendar(false)
                })
        } else {
            // Clear calendar data when no listing is selected
            setCalendarData({})
            setIsLoadingCalendar(false)
        }
    }, [form.watch('listingId'), form.watch('variantId')])



    const downloadCalendar = async () => {
        const element = document.getElementById('calendar-to-capture');
        if (!element) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toPng(element, { cacheBust: true, backgroundColor: '#ffffff' });

            const link = document.createElement('a');
            link.download = `calendar-${monthNames[month]}-${year}.png`;
            link.href = dataUrl;
            link.click();

            showToast('success', 'Calendar downloaded successfully');
        } catch (error) {
            console.error('Error downloading calendar:', error);
            showToast('error', `Failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isToday = (day) => {
        const date = new Date(year, month, day)
        return date.toDateString() === today.toDateString()
    }

    // Status configurations
    const statusConfig = {
        available: {
            icon: Check,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            textColor: 'text-green-700 dark:text-green-300',
            iconColor: 'text-green-600 dark:text-green-400',
            badgeBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            label: 'Available'
        },
        booked: {
            icon: Clock,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            textColor: 'text-red-700 dark:text-red-300',
            iconColor: 'text-red-600 dark:text-red-400',
            badgeBg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            label: 'Booked'
        },
        blocked: {
            icon: Ban,
            bgColor: 'bg-gray-50 dark:bg-gray-800/50',
            borderColor: 'border-gray-200 dark:border-gray-700',
            textColor: 'text-gray-600 dark:text-gray-400',
            iconColor: 'text-gray-500 dark:text-gray-500',
            badgeBg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            label: 'Blocked'
        }
    }

    const getStatusIcon = (status) => {
        const Icon = statusConfig[status]?.icon || Check
        return <Icon className="w-3 h-3" />
    }

    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumbData} />

            <Card className="rounded-lg shadow-sm border-0">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar Management</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage availability, pricing, and bookings for your listings</p>
                        </div>
                        <CalendarIcon className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Selection Card */}
                            <div className="bg-pink-100 dark:bg-pink-950 p-6 rounded-xl border border-pink-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                                        <Tag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Select Listing</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {hasVariants ? 'Choose a listing and its variant' : 'Choose which listing you want to manage dates for'}
                                        </p>
                                    </div>
                                </div>

                                {/* Listing Selection */}
                                <div className="mb-4">
                                    <FormLabel className="text-gray-900 dark:text-white font-medium mb-2 block">Listing</FormLabel>
                                    <FormField
                                        control={form.control}
                                        name="listingId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        options={listingOptions}
                                                        selected={field.value}
                                                        setSelected={(value) => {
                                                            field.onChange(value)
                                                            // Reset variant when listing changes
                                                            form.setValue('variantId', '')
                                                        }}
                                                        isMulti={false}
                                                        placeholder="Select a listing..."
                                                        className="bg-white dark:bg-gray-800 border-pink-200 dark:border-gray-700"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Variant Selection - Only show if listing has variants */}
                                {hasVariants && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <FormLabel className="text-gray-900 dark:text-white font-medium">Select Variant (Optional)</FormLabel>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            This listing has variants. Select a variant to manage specific calendar, or leave empty to manage the main listing.
                                        </p>
                                        <FormField
                                            control={form.control}
                                            name="variantId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            options={[
                                                                { label: 'Main Listing (No Variant)', value: '' },
                                                                ...listingVariantOptions
                                                            ]}
                                                            selected={field.value || ''}
                                                            setSelected={field.onChange}
                                                            isMulti={false}
                                                            placeholder="Select a variant or use main listing..."
                                                            className="bg-white dark:bg-gray-800 border-pink-200 dark:border-gray-700"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Show message if no variants */}
                                {form.watch('listingId') && !hasVariants && listingVariantOptions.length === 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            This listing has no variants. Managing calendar for main listing.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Calendar Card */}
                            <div id="calendar-to-capture" className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handlePrevMonth}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                                </button>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {monthNames[month]} {year}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={handleNextMonth}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                                </button>
                                            </div>

                                            {isLoadingCalendar && (
                                                <Badge variant="outline" className="animate-pulse">
                                                    Loading...
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={downloadCalendar}
                                                disabled={isDownloading}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 shadow-sm"
                                            >
                                                {isDownloading ? (
                                                    <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Download className="w-4 h-4" />
                                                )}
                                                Save as PNG
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected Dates Count */}
                                    {selectedDates.length > 0 && (
                                        <Badge className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 mt-2 md:mt-0">
                                            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                                        </Badge>
                                    )}

                                    {/* Day Names Header */}
                                    <div className="grid grid-cols-7 gap-2 mt-6">
                                        {fullDayNames.map((day, index) => (
                                            <div key={day} className="text-center">
                                                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                    {day}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {dayNames[index]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="p-6">
                                    <div className="grid grid-cols-7 gap-3">
                                        {/* Empty cells before month starts */}
                                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                            <div key={`empty-${index}`} className="aspect-square"></div>
                                        ))}

                                        {/* Calendar Days */}
                                        {Array.from({ length: daysInMonth }).map((_, index) => {
                                            const day = index + 1
                                            const dateKey = formatDateKey(year, month, day)
                                            const dateData = calendarData[dateKey]
                                            const isSelected = selectedDates.includes(dateKey)
                                            const currentDateObj = new Date(year, month, day)
                                            const isPast = currentDateObj < today
                                            const todayClass = isToday(day) ? 'ring-2 ring-pink-500 dark:ring-pink-400' : ''
                                            const config = dateData ? statusConfig[dateData.status] : null

                                            let cellClass = cn(
                                                'aspect-square rounded-lg p-3 flex flex-col transition-all duration-200',
                                                'border-2',
                                                todayClass,
                                                isPast
                                                    ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-60'
                                                    : isSelected
                                                        ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-600 shadow-md cursor-pointer'
                                                        : dateData
                                                            ? cn(
                                                                config?.bgColor,
                                                                config?.borderColor,
                                                                'hover:shadow-md cursor-pointer hover:opacity-90'
                                                            )
                                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-sm cursor-pointer'
                                            )

                                            return (
                                                <div
                                                    key={day}
                                                    onClick={() => !isPast && handleDateClick(dateKey, day)}
                                                    className={cellClass}
                                                >
                                                    {/* Day Number */}
                                                    <div className="flex justify-between items-start">
                                                        <div className={cn(
                                                            'text-lg font-semibold',
                                                            isToday(day) ? 'text-pink-600 dark:text-pink-400' :
                                                                isPast ? 'text-gray-400 dark:text-gray-600' :
                                                                    isSelected ? 'text-pink-700 dark:text-pink-300' :
                                                                        dateData ? config?.textColor : 'text-gray-900 dark:text-gray-200'
                                                        )}>
                                                            {day}
                                                        </div>

                                                        {/* Status Icon */}
                                                        {dateData && (
                                                            <div className={cn(
                                                                'p-1 rounded-full',
                                                                config?.bgColor
                                                            )}>
                                                                {getStatusIcon(dateData.status)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Status and Price */}
                                                    <div className="mt-2 space-y-1">
                                                        {dateData ? (
                                                            <>
                                                                <div className={cn(
                                                                    'text-xs font-medium truncate',
                                                                    config?.textColor
                                                                )}>
                                                                    {config?.label}
                                                                </div>
                                                                {dateData.price > 0 && (
                                                                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                                                        Rs{dateData.price}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : !isPast && (
                                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                                Click to select
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Selection Indicator */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Calendar Legend</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(statusConfig).map(([status, config]) => (
                                        <div key={status} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className={cn(
                                                'p-2 rounded-lg',
                                                config.bgColor,
                                                config.borderColor,
                                                'border'
                                            )}>
                                                {getStatusIcon(status)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{config.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Date status</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-300 dark:border-pink-600">
                                            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Selected</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Click to select</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar */}
                            {selectedDates.length > 0 && (
                                <div className="sticky bottom-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                                <CalendarIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedDates.map(date => new Date(date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })).join(', ')}
                                                </div>
                                                {form.watch('listingId') && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {form.watch('variantId') ? 'Managing variant calendar' : 'Managing main listing calendar'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDates([])
                                                    form.setValue('dates', [])
                                                }}
                                                className="cursor-pointer px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={openModal}
                                                disabled={!form.getValues('listingId') || (hasVariants && !form.getValues('variantId'))}
                                                className="cursor-pointer px-6 py-2.5 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                            >
                                                Configure Dates
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hidden form field */}
                            <FormField
                                control={form.control}
                                name="dates"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormControl>
                                            <Input type="hidden" {...field} value={field.value.join(',')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                        <CalendarIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configure Dates</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                                        </p>
                                        {form.watch('variantId') && (
                                            <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                                                For variant: {listingVariantOptions.find(v => v.value === form.watch('variantId'))?.label}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <Form {...form}>
                                <div className="space-y-6">
                                    {/* Status Selection */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 ">
                                            <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <FormLabel className="text-gray-900 dark:text-white font-medium ">Date Status</FormLabel>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="dateStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            options={statusOptions}
                                                            selected={field.value}
                                                            setSelected={field.onChange}
                                                            isMulti={false}
                                                            className="bg-white dark:bg-gray-800 "
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Price Input */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Money className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <FormLabel className="text-gray-900 dark:text-white font-medium">Offering Price (Optional)</FormLabel>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                                                Rs
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                className="pl-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Leave as 0 to use listing's default starting Price
                                        </p>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            disabled={loading}
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <ButtonLoading
                                            loading={loading}
                                            onClick={form.handleSubmit(onSubmit)}
                                            text="Save Changes"
                                            className="flex-1 px-4 py-3 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                        />
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListingCalendar