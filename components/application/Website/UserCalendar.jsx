'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Calendar from '../Calendar'
import { showToast } from '@/lib/showToast'

const UserCalendar = ({ listingId, variantId = null, onDateSelect, selectedDates = [], disabledDates = [], maxSelectable = 1 }) => {
    const [calendarData, setCalendarData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState(selectedDates || [])

    // Fetch calendar data
    const fetchCalendarData = useCallback(async () => {
        try {
            setIsLoading(true)
            let url = `/api/website/calendar?listingId=${listingId}`
            if (variantId) {
                url += `&variantId=${variantId}`
            }
            const response = await fetch(url)
            const result = await response.json()

            if (result.success) {
                // Transform the API data to match the Calendar component format
                const transformedData = {}

                result.data.forEach(item => {
                    const date = new Date(item.date)
                    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

                    // Treat null/undefined status as 'available'
                    const status = item.dateStatus || 'available'

                    transformedData[dateKey] = {
                        status: status,
                        price: item.price || null
                    }
                })

                setCalendarData(transformedData)
            } else {
                showToast("error", result.message || "Failed to fetch calendar data")
            }
        } catch (error) {
            showToast("error", "Failed to fetch calendar data")
        } finally {
            setIsLoading(false)
        }
    }, [listingId, variantId])

    useEffect(() => {
        if (listingId) {
            fetchCalendarData()
        }
    }, [listingId, variantId, fetchCalendarData])

    useEffect(() => {
        setSelected(selectedDates || [])
    }, [selectedDates])

    // Handle date selection
    const handleDateSelect = (dates) => {
        // If dates is null or undefined just ignore
        if (!dates) return

        // When only one date allowed, always keep last choice
        if (maxSelectable === 1 && dates.length > 1) {
            // assume the most recently added date is at the end
            dates = [dates[dates.length - 1]]
        }

        // Allow clearing all selections
        if (dates.length === 0) {
            setSelected([])
            if (onDateSelect) onDateSelect([], {})
            return
        }

        // Prevent selecting more than maxSelectable dates
        if (dates.length > maxSelectable && maxSelectable > 0) {
            showToast("error", `You can only select up to ${maxSelectable} date(s)`)
            return
        }

        // Filter out disabled dates and dates that are not 'available'
        const validDates = dates.filter(dateKey => {
            const dateData = calendarData[dateKey]
            const status = dateData?.status || 'available'

            return !disabledDates.includes(dateKey) && status === 'available'
        })

        setSelected(validDates)

        // Build date prices map for selected dates (for discount calculation)
        const datePrices = {}
        validDates.forEach(dateKey => {
            const price = calendarData[dateKey]?.price
            if (price != null) datePrices[dateKey] = price
        })

        if (onDateSelect) {
            onDateSelect(validDates, datePrices)
        }
    }

    // Determine which dates should be disabled
    const getDisabledDates = () => {
        const disabled = [...disabledDates]

        // Add dates that are not 'available' to disabled dates
        Object.entries(calendarData).forEach(([dateKey, data]) => {
            if (data.status !== 'available') {
                disabled.push(dateKey)
            }
        })

        return [...new Set(disabled)] // Remove duplicates
    }

    // Get status for a specific date
    const getDateStatus = (dateKey) => {
        const dateData = calendarData[dateKey]
        // If date doesn't exist in calendarData, treat it as 'available'
        return dateData?.status || 'available'
    }

    // Handle individual date click
    const handleDateClick = (dateKey, dateData) => {
        const status = dateData?.status || 'available'

        if (status !== 'available') {
            let message = ''
            switch (status) {
                case 'booked':
                    message = "This date is already booked"
                    break
                case 'blocked':
                    message = "This date is blocked by the host"
                    break
                default:
                    message = "This date is not available"
            }

            showToast("error", message)
        }
    }

    // Format selected dates for display
    const formatSelectedDates = () => {
        return selected.map(dateKey => {
            const [year, month, day] = dateKey.split('-')
            return new Date(year, month - 1, day)
        })
    }

    // Modified calendar data that treats missing dates as available
    const getCalendarDataWithDefaults = () => {
        // We'll use this to ensure all dates are treated properly
        // The Calendar component already handles missing dates as available
        // because we set status to 'available' for missing dates in getDateStatus
        return calendarData
    }

    return (
        <div className="space-y-4">
            <Calendar
                calendarData={getCalendarDataWithDefaults()}
                mode="select"
                onDateSelect={handleDateSelect}
                selectedDates={selected}
                onDateClick={handleDateClick}
                isLoading={isLoading}
                disabledDates={getDisabledDates()}
                selectable={true}
                showLegend={true}
                showPrice={true}
                showStatus={true}
                showHeader={true}
                compact={false}
                highlightToday={true}
                hidePriceOnBooked={true}
            />

            {/* Selected dates summary */}
            {selected && selected.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Selected Date{selected.length > 1 ? 's' : ''}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selected.map((dateKey) => {
                            const [year, month, day] = dateKey.split('-')
                            const date = new Date(year, month - 1, day)
                            const dateData = calendarData[dateKey]
                            const status = getDateStatus(dateKey)

                            return (
                                <div
                                    key={dateKey}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-md border border-blue-200 dark:border-blue-700"
                                >
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {date.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {status}
                                    </span>
                                    {dateData?.price && (
                                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                            {dateData.price}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSelected = selected.filter(d => d !== dateKey)
                                            handleDateSelect(newSelected)
                                        }}
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserCalendar