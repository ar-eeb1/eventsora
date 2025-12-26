'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, DollarSign, Check, Clock, Ban } from 'lucide-react'
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
    }
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
    
    // Callbacks
    onDateClick,
    
    // Rest props
    ...props
}) => {
    const [internalCurrentDate, setInternalCurrentDate] = useState(externalCurrentDate || new Date())
    const currentDate = externalCurrentDate || internalCurrentDate
    
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

    const handleDateClick = (dateKey, day) => {
        if (!selectable) return
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        
        if (clickedDate < today) return
        if (disabledDates.includes(dateKey)) return
        
        if (mode === 'select' && onDateSelect) {
            if (selectedDates.includes(dateKey)) {
                onDateSelect(selectedDates.filter(d => d !== dateKey))
            } else {
                onDateSelect([...selectedDates, dateKey])
            }
        }
        
        if (onDateClick) {
            onDateClick(dateKey, calendarData[dateKey])
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
            <div className={cn("border border-gray-200 dark:border-gray-700 rounded-xl p-4", className)}>
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
        <div className={cn("border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900", className)} {...props}>
            {showHeader && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {monthNames[month]} {year}
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                            
                            {mode === 'select' && selectedDates.length > 0 && (
                                <Badge className="bg-blue-600 text-white">
                                    {selectedDates.length} selected
                                </Badge>
                            )}
                        </div>
                    </div>
                    
                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 gap-2 mt-4">
                        {fullDayNames.map((day, index) => (
                            <div key={day} className="text-center">
                                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
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
                        const todayClass = highlightToday && isToday(day) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                        const isDisabled = disabledDates.includes(dateKey)
                        const config = dateData ? statusConfig[dateData.status] : null

                        let cellClass = cn(
                            'aspect-square rounded-lg p-2 flex flex-col transition-all duration-200',
                            'border',
                            todayClass,
                            isPast || isDisabled
                                ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-60'
                                : isSelected && mode === 'select'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md cursor-pointer'
                                : dateData
                                ? cn(
                                    config?.bgColor,
                                    config?.borderColor,
                                    selectable && 'hover:shadow-md cursor-pointer hover:opacity-90'
                                )
                                : selectable 
                                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm cursor-pointer'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        )

                        return (
                            <div
                                key={day}
                                onClick={() => handleDateClick(dateKey, day)}
                                className={cellClass}
                            >
                                {/* Day Number */}
                                <div className="flex justify-between items-start">
                                    <div className={cn(
                                        'font-semibold',
                                        isToday(day) ? 'text-blue-600 dark:text-blue-400' :
                                        isPast || isDisabled ? 'text-gray-400 dark:text-gray-600' :
                                        isSelected ? 'text-blue-700 dark:text-blue-300' :
                                        dateData ? config?.textColor : 'text-gray-900 dark:text-gray-200'
                                    )}>
                                        {day}
                                    </div>
                                    
                                    {/* Status Icon */}
                                    {showStatus && dateData && (
                                        <div className={cn(
                                            'p-1 rounded-full',
                                            config?.bgColor
                                        )}>
                                            {getStatusIcon(dateData.status)}
                                        </div>
                                    )}
                                </div>

                                {/* Status and Price */}
                                <div className="mt-1 space-y-0.5">
                                    {showStatus && dateData && !compact && (
                                        <div className={cn(
                                            'text-xs font-medium truncate',
                                            config?.textColor
                                        )}>
                                            {config?.label}
                                        </div>
                                    )}
                                    {showPrice && dateData?.price > 0 && !compact && (
                                        <div className="flex items-center gap-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            <DollarSign className="w-2.5 h-2.5" />
                                            {dateData.price}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Selection Indicator */}
                                {isSelected && mode === 'select' && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <div key={status} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <div className={cn('w-2 h-2 rounded-full', config.bgColor, config.borderColor, 'border')}></div>
                                <span className="text-xs text-gray-700 dark:text-gray-300">{config.label}</span>
                            </div>
                        ))}
                        {mode === 'select' && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-700 dark:text-gray-300">Selected</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar