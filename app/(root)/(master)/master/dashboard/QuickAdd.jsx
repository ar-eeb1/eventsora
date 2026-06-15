'use client'
import Link from 'next/link'
import { Banknote, Calendar, CalendarCheck, Earth, Landmark, List, MenuIcon, Plus, User } from 'lucide-react';
import React from 'react'
import { MASTER_CATEGORY_ADD, MASTER_CITY_ADD, MASTER_COUNTRY_ADD, MASTER_LOCALITY_ADD, MASTER_LOCALITY_SHOW, MASTER_STATE_ADD, MASTER_SUB_CATEGORY_ADD, MASTER_SUBLOCALITY_ADD, MASTER_USER_SHOW } from '@/routes/MasterPanelRoute';
import { LocalSee, LocationCity } from '@mui/icons-material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

const QuickAdd = () => {
    return (
        <div>
            <h1 className='bg-pink-200 p-3 rounded-md mt-4 dark:bg-pink-900'>Shortcut</h1>
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:gap-10 gap-5 mt-4 lg:gap-5">

                <Link href={MASTER_CATEGORY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-pink-100 via-pink-200 to-pink-100 dark:from-pink-900/40 dark:via-pink-800/40 dark:to-pink-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-pink-900 dark:text-pink-200">
                                New Category
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 dark:bg-pink-800/50 dark:text-pink-200">
                            <List size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_SUB_CATEGORY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-purple-900 dark:text-purple-200">
                                New Subcategory
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-fullbg-purple-200 text-purple-700dark:bg-purple-800/50 dark:text-purple-200">
                            <Banknote size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_COUNTRY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-rose-100 via-rose-200 to-rose-100 dark:from-rose-900/40 dark:via-rose-800/40 dark:to-rose-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-rose-900 dark:text-rose-200">
                                New Country
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-200 text-rose-700 dark:bg-rose-800/50 dark:text-rose-200">
                            <Earth size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_STATE_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-fuchsia-100 via-fuchsia-200 to-fuchsia-100 dark:from-fuchsia-900/40 dark:via-fuchsia-800/40 dark:to-fuchsia-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-fuchsia-900 dark:text-fuchsia-200">
                                New State
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-800/50 dark:text-fuchsia-200">
                            <Landmark size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_CITY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-sky-100 via-sky-200 to-sky-100 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-sky-900 dark:text-sky-200">
                                New City
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-200 text-sky-700 dark:bg-sky-800/50 dark:text-sky-200">
                            <LocationCity size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_LOCALITY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-blue-900 dark:text-blue-200">
                                New Locality
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 dark:bg-blue-800/50 dark:text-blue-200">
                            <AddLocationIcon size={20} />
                        </span>
                    </div>
                </Link>

                <Link href={MASTER_SUBLOCALITY_ADD}>
                    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-linear-to-tr from-green-100 via-green-200 to-green-100 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-900/40 transition-transform hover:scale-[1.02]">
                        <div>
                            <h4 className="flex justify-center items-center text-sm font-medium text-green-900 dark:text-green-200">
                                New Sublocality
                            </h4>
                        </div>
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-green-200 text-green-700 dark:bg-green-800/50 dark:text-green-200">
                            <MapsHomeWorkIcon size={20} />
                        </span>
                    </div>
                </Link>

            </div>


        </div>
    )
}

export default QuickAdd
