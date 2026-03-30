'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Clock, Ban, X, Phone, User, CreditCard, Calendar as CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// Status configurations
const statusConfig = {
    available: {
        icon: Check,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-400',
        label: 'Available'
    },
    booked: {
        icon: Clock,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        iconColor: 'text-red-600 dark:text-red-400',
        label: 'Booked'
    },
    blocked: {
        icon: Ban,
        bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        borderColor: 'border-gray-200 dark:border-gray-700',
        textColor: 'text-gray-600 dark:text-gray-400',
        iconColor: 'text-gray-500 dark:text-gray-500',
        label: 'Blocked'
    },
    confirmed: {
        icon: Check,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-400',
        label: 'Confirmed'
    },
    pending: {
        icon: Clock,
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-700 dark:text-amber-300',
        iconColor: 'text-amber-600 dark:text-amber-400',
        label: 'Pending'
    },
    cancelled: {
        icon: Ban,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        iconColor: 'text-red-600 dark:text-red-400',
        label: 'Cancelled'
    },
    'awaiting-payment': {
        icon: Clock,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300',
        iconColor: 'text-blue-600 dark:text-blue-400',
        label: 'Awaiting Payment'
    },
    completed: {
        icon: Check,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-400',
        label: 'Completed'
    },
    unverified: {
        icon: Ban,
        bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        borderColor: 'border-gray-200 dark:border-gray-700',
        textColor: 'text-gray-600 dark:text-gray-400',
        iconColor: 'text-gray-500 dark:text-gray-500',
        label: 'Unverified'
    }
}

// Booking detail popup shown when clicking a calendar cell
const BookingDetailPopup = ({ dateKey, data, onClose }) => {
    const ref = useRef(null)

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
        document.addEventListener('keydown', handleKey)
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.removeEventListener('mousedown', handleClick)
        }
    }, [onClose])

    const config = data?.status ? statusConfig[data.status] : null
    const bookingStatusConfig = data?.bookingStatus ? statusConfig[data.bookingStatus] : null
    const [year, month, day] = (dateKey || '').split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const displayDate = dateKey ? `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}` : ''

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
            <div
                ref={ref}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm animate-in zoom-in-95 duration-150"
            >
                {/* Header */}
                <div className={cn(
                    'flex items-center justify-between px-5 py-4 rounded-t-2xl border-b border-gray-100 dark:border-gray-800',
                    config?.bgColor || 'bg-gray-50 dark:bg-gray-800'
                )}>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className={cn('w-5 h-5', config?.iconColor || 'text-gray-500')} />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayDate}</p>
                            {config && (
                                <span className={cn('text-xs font-medium', config.textColor)}>{config.label}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3">
                    {/* Price */}
                    {data?.price > 0 && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {data.price.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    )}

                    {/* Booking Details — only shown when a booking exists */}
                    {data?.name && (
                        <>
                            <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <User className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Booked By</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</p>
                                </div>
                            </div>

                            {data.phone && (
                                <div className="flex items-center gap-3 py-1">
                                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-wide">Contact</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800 mt-2">
                                {data.bookingStatus && (
                                    <span className={cn(
                                        'text-xs px-2.5 py-1 rounded-full font-medium capitalize',
                                        bookingStatusConfig?.bgColor,
                                        bookingStatusConfig?.textColor
                                    )}>
                                        {data.bookingStatus}
                                    </span>
                                )}
                                {data.paymentStatus && (
                                    <span className={cn(
                                        'text-xs px-2.5 py-1 rounded-full font-medium capitalize',
                                        data.paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : data.paymentStatus === 'pending'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {data.paymentStatus}
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {!data?.name && !data?.price && (
                        <p className="text-sm text-gray-400 text-center py-2">No details for this date.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Calendar = ({
    // Data Props
    calendarData = {},

    // Mode Props
    mode = 'view',
    onDateSelect,
    selectedDates = [],

    // Calendar Props
    currentDate: externalCurrentDate,
    onMonthChange,

    // UI Props
    showLegend = true,
    showPrice = true,
    showStatus = true,
    selectable = true,
    showHeader = true,

    // State Props
    isLoading = false,
    disabledDates = [],

    // Styling Props
    className,
    compact = false,
    highlightToday = true,

    // Locked statuses — dates with these statuses AND a booking (name field) cannot be selected
    lockedStatuses = ['booked'],

    // Callbacks
    onDateClick,

    // Rest props
    ...props
}) => {
    const [internalCurrentDate, setInternalCurrentDate] = useState(externalCurrentDate || new Date())
    const currentDate = externalCurrentDate || internalCurrentDate

    // Popup state
    const [popup, setPopup] = useState(null) // { dateKey, data }

    const setCurrentDate = (date) => {
        if (onMonthChange) {
            onMonthChange(date)
        } else {
            setInternalCurrentDate(date)
        }
    }

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

    const formatDateKey = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const handleDateClick = (dateKey, day, dateData) => {
        // Always show popup when a date is clicked
        setPopup({ dateKey, data: dateData })

        // Invoke external callback if provided
        if (onDateClick) {
            onDateClick(dateKey, dateData)
        }

        if (!selectable) return

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        if (clickedDate < today) return
        if (disabledDates.includes(dateKey)) return

        // Lock: dates with a real booking (name exists) that are in lockedStatuses cannot be selected
        const isLocked = dateData && lockedStatuses.includes(dateData.status) && !!dateData.name
        if (isLocked) return

        if (mode === 'select' && onDateSelect) {
            if (selectedDates.includes(dateKey)) {
                onDateSelect(selectedDates.filter(d => d !== dateKey))
            } else {
                onDateSelect([...selectedDates, dateKey])
            }
        }
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isToday = (day) => {
        const date = new Date(year, month, day)
        return date.toDateString() === today.toDateString()
    }

    const getStatusIcon = (status) => {
        const Icon = statusConfig[status]?.icon || Check
        return <Icon className="w-3 h-3" />
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <div className={cn("border border-pink-200  dark:border-pink-700 rounded-xl p-4", className)}>
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-3">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-6" />
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(42)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Booking detail popup */}
            {popup && (
                <BookingDetailPopup
                    dateKey={popup.dateKey}
                    data={popup.data}
                    onClose={() => setPopup(null)}
                />
            )}

            <div className={cn("my-6 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 shadow-xs", className)} {...props}>
                {showHeader && (
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 pl-2">
                                {monthNames[month]} {year}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full transition-colors flex items-center justify-center border border-gray-200 dark:border-gray-800"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full transition-colors flex items-center justify-center border border-gray-200 dark:border-gray-800"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {mode === 'select' && selectedDates.length > 0 && (
                            <div className="mt-2 pl-2">
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    {selectedDates.length} selected
                                </Badge>
                            </div>
                        )}

                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 gap-2 mt-6">
                            {fullDayNames.map((day, index) => (
                                <div key={day} className="text-center">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {compact ? dayNames[index] : day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Calendar Grid */}
                <div className="p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div key={`empty-${index}`} className=""></div>
                        ))}

                        {/* Calendar Days */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1
                            const dateKey = formatDateKey(year, month, day)
                            const dateData = calendarData[dateKey]
                            const isSelected = selectedDates.includes(dateKey)
                            const currentDateObj = new Date(year, month, day)
                            const isPast = currentDateObj < today
                            const todayClass = highlightToday && isToday(day) ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-950' : ''
                            const isDisabled = disabledDates.includes(dateKey)
                            const config = dateData ? statusConfig[dateData.status] : null

                            // A date is "locked" if it has a booking AND its status is in lockedStatuses
                            const isLocked = dateData && lockedStatuses.includes(dateData.status) && !!dateData.name

                            let cellClass = cn(
                                'md:min-h-[120px] min-h-[80px] rounded-lg p-3 flex flex-col transition-all duration-200 relative group cursor-pointer overflow-hidden',
                                'border',
                                todayClass,
                                isPast || isDisabled
                                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                    : isLocked
                                        // Locked (booked with a real booking) — highlighted but not selectable
                                        ? cn(config?.bgColor, config?.borderColor, 'cursor-pointer hover:shadow-md hover:opacity-90')
                                        : isSelected && mode === 'select'
                                            ? 'bg-primary/5 border-primary dark:border-primary/50 shadow-md cursor-pointer'
                                            : dateData
                                                ? cn(
                                                    config?.bgColor === 'bg-green-50 dark:bg-green-900/20' ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary/50' : config?.bgColor,
                                                    config?.borderColor,
                                                    selectable && 'hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                                                )
                                                : selectable
                                                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-sm cursor-pointer hover:-translate-y-0.5'
                                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                            )

                            // Override for simplified Available look
                            if (dateData?.status === 'available' && !isSelected && !isPast && !isDisabled) {
                                cellClass = cn(cellClass, 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800')
                            }

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleDateClick(dateKey, day, dateData)}
                                    className={cellClass}
                                >
                                    {/* Selection Indicator */}
                                    {isSelected && mode === 'select' && !isLocked && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-gray-900"></div>
                                    )}

                                    {/* Locked indicator */}
                                    {isLocked && (
                                        <div className="absolute top-2 right-2">
                                            <Ban className="w-3 h-3 text-red-400 opacity-70" />
                                        </div>
                                    )}

                                    {/* Day Number */}
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            'text-lg font-medium',
                                            isToday(day) ? 'text-primary' :
                                                isPast || isDisabled ? 'text-gray-400 dark:text-gray-600' :
                                                    isSelected ? 'text-primary' :
                                                        'text-gray-700 dark:text-gray-200'
                                        )}>
                                            {day}
                                        </div>
                                    </div>

                                    {/* Status and Price Content */}
                                    <div className="mt-auto space-y-1">
                                        {showStatus && dateData && !compact && dateData.status !== 'available' && (
                                            <div className={cn(
                                                'text-xs font-medium px-2 py-1 rounded-md w-fit',
                                                config?.bgColor,
                                                config?.textColor
                                            )}>
                                                {config?.label}
                                            </div>
                                        )}

                                        {showStatus && dateData && !compact && dateData.status === 'available' && (
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Available
                                            </div>
                                        )}

                                        {showPrice && dateData?.price > 0 && !compact && (
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {dateData.price.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
                                            </div>
                                        )}

                                        {/* Booking details (compact) */}
                                        {dateData?.name && !compact && (
                                            <div className="pt-1 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-0.5">
                                                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={dateData.name}>
                                                    {dateData.name}
                                                </div>
                                                {dateData.phone && (
                                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                        {dateData.phone}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-0.5 mt-0.5">
                                                    {dateData.bookingStatus && (
                                                        <span className="text-[9px] px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
                                                            {dateData.bookingStatus}
                                                        </span>
                                                    )}
                                                    {dateData.paymentStatus && (
                                                        <span className={cn(
                                                            "text-[9px] px-1 py-0.5 rounded uppercase tracking-tighter",
                                                            dateData.paymentStatus === 'paid'
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                        )}>
                                                            {dateData.paymentStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Legend */}
                {showLegend && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex flex-wrap items-center gap-6 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-gray-300 bg-white"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Booked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Blocked</span>
                            </div>
                            {mode === 'select' && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Selected</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Ban className="w-3 h-3 text-red-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Locked (from booking)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Calendar