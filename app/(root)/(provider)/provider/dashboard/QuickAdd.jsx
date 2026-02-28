'use client'
import Link from 'next/link'
import { Banknote, Calendar, Calendar1, CalendarCheck, ChartAreaIcon, Earth, Landmark, List, ListFilterPlus, MessageCircle, TextAlignEnd } from 'lucide-react';
import React from 'react'
import useFetch from '@/hooks/useFetch';
import { PROVIDER_LISTING_ADD, PROVIDER_LISTING_CALENDAR, PROVIDER_LISTING_VARIANT_ADD, PROVIDER_MESSAGES } from '@/routes/ProviderPanelRoute';
import { LocationCity } from '@mui/icons-material';

const QuickAdd = () => {
    return (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-5 mt-4 lg:gap-5">

            <Link href={PROVIDER_LISTING_ADD}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-pink-100 via-pink-200 to-pink-100 dark:from-pink-900/40 dark:via-pink-800/40 dark:to-pink-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-pink-900 dark:text-pink-200">
                            New Listing
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 dark:bg-pink-800/50 dark:text-pink-200">
                        <ListFilterPlus size={20} />
                    </span>
                </div>
            </Link>
            <Link href={PROVIDER_LISTING_VARIANT_ADD}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-pink-200 via-pink-300 to-pink-200 dark:from-pink-950/40 dark:via-pink-900/40 dark:to-pink-950/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-pink-900 dark:text-pink-200">
                            New Listing Variant
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 dark:bg-pink-800/50 dark:text-pink-200">
                        <TextAlignEnd size={20} />
                    </span>
                </div>
            </Link>

            <Link href={PROVIDER_LISTING_CALENDAR}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-purple-900 dark:text-purple-200">
                            Manage Calendar
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-fullbg-purple-200 text-purple-700dark:bg-purple-800/50 dark:text-purple-200">
                        <Calendar1 size={20} />
                    </span>
                </div>
            </Link>

            <Link href={PROVIDER_MESSAGES}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-rose-100 via-rose-200 to-rose-100 dark:from-rose-900/40 dark:via-rose-800/40 dark:to-rose-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-rose-900 dark:text-rose-200">
                            Chats
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-200 text-rose-700 dark:bg-rose-800/50 dark:text-rose-200">
                        <MessageCircle size={20} />
                    </span>
                </div>
            </Link>

            {/* <Link href={''}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-fuchsia-100 via-fuchsia-200 to-fuchsia-100 dark:from-fuchsia-900/40 dark:via-fuchsia-800/40 dark:to-fuchsia-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-fuchsia-900 dark:text-fuchsia-200">
                            add if any
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-800/50 dark:text-fuchsia-200">
                        <Landmark size={20} />
                    </span>
                </div>
            </Link>

            <Link href={''}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-sky-100 via-sky-200 to-sky-100 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-sky-900 dark:text-sky-200">
                            add if any
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-200 text-sky-700 dark:bg-sky-800/50 dark:text-sky-200">
                        <LocationCity size={20} />
                    </span>
                </div>
            </Link>

            <Link href={''}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-blue-900 dark:text-blue-200">
                            add if any
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 dark:bg-blue-800/50 dark:text-blue-200">
                        <LocationCity size={20} />
                    </span>
                </div>
            </Link>

            <Link href={''}>
                <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-green-100 via-green-200 to-green-100 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-900/40 transition-transform hover:scale-[1.02]">
                    <div>
                        <h4 className="flex justify-center items-center text-sm font-medium text-green-900 dark:text-green-200">
                            add if any
                        </h4>
                    </div>
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-green-200 text-green-700 dark:bg-green-800/50 dark:text-green-200">
                        <LocationCity size={20} />
                    </span>
                </div>
            </Link> */}

        </div>
    )
}

export default QuickAdd