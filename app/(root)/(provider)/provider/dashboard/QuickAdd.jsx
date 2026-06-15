'use client'
import Link from 'next/link'
import {
    Calendar1,
    ListFilterPlus,
    MessageCircle,
    TextAlignEnd
} from 'lucide-react';
import React from 'react'
import {
    PROVIDER_LISTING_ADD,
    PROVIDER_LISTING_CALENDAR,
    PROVIDER_LISTING_VARIANT_ADD,
    PROVIDER_MESSAGES
} from '@/routes/ProviderPanelRoute';
import ManualBookingModal from '../bookings/ManualBookingModal';

const QuickAdd = () => {

    const cardStyle = "group flex items-center justify-between p-5 rounded-xl border bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

    const titleStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    const iconBase = "w-12 h-12 flex items-center justify-center rounded-full text-white shadow-md";

    return (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mt-4">

            {/* New Listing */}
            {/* <Link href={PROVIDER_LISTING_ADD}>
                <div className={cardStyle}>
                    <h4 className={titleStyle}>New Listing</h4>
                    <div className={`${iconBase} bg-gradient-to-tr from-pink-500 to-rose-500`}>
                        <ListFilterPlus size={20} />
                    </div>
                </div>
            </Link> */}

            {/* New Variant */}
            {/* <Link href={PROVIDER_LISTING_VARIANT_ADD}>
                <div className={cardStyle}>
                    <h4 className={titleStyle}>New Variant</h4>
                    <div className={`${iconBase} bg-gradient-to-tr from-purple-500 to-indigo-600`}>
                        <TextAlignEnd size={20} />
                    </div>
                </div>
            </Link> */}

            {/* NEW BOOKING */}
            <ManualBookingModal>
                <div className={`${cardStyle} cursor-pointer`}>
                    <h4 className={titleStyle}>New Booking</h4>
                    <div className={`${iconBase} bg-gradient-to-tr from-pink-500 to-rose-600`}>
                        <ListFilterPlus size={20} />
                    </div>
                </div>
            </ManualBookingModal>

            {/* Calendar */}
            <Link href={PROVIDER_LISTING_CALENDAR}>
                <div className={cardStyle}>
                    <h4 className={titleStyle}>Manage Calendar</h4>
                    <div className={`${iconBase} bg-gradient-to-tr from-sky-500 to-blue-600`}>
                        <Calendar1 size={20} />
                    </div>
                </div>
            </Link>

            {/* Messages */}
            <Link href={PROVIDER_MESSAGES}>
                <div className={cardStyle}>
                    <h4 className={titleStyle}>Messages</h4>
                    <div className={`${iconBase} bg-gradient-to-tr from-emerald-500 to-green-600`}>
                        <MessageCircle size={20} />
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default QuickAdd