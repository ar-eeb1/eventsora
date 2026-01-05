'use client'
import React from 'react'
import UserCalendar from './UserCalendar'
import { Skeleton } from '@/components/ui/skeleton'

export const AvailabilityCalendar = ({ 
    listingId, 
    onDateSelect, 
    selectedDates = [],
    disabledDates = [],
    maxSelectable = 1,
    isLoading: externalLoading = false,
    ...props 
}) => {
    if (!listingId) {
        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    Please provide a listing ID
                </p>
            </div>
        )
    }

    if (externalLoading) {
        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(42)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <UserCalendar
            listingId={listingId}
            onDateSelect={onDateSelect}
            selectedDates={selectedDates}
            disabledDates={disabledDates}
            maxSelectable={maxSelectable}
            {...props}
        />
    )
}

export default AvailabilityCalendar