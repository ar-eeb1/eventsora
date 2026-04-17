'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import Filter from '@/components/application/Website/Filter'
import Sorting from '@/components/application/Website/Sorting'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import { WEBSITE_CATEGORY } from '@/routes/WebsiteRoute'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import ListingBox from '@/components/application/Website/ListingBox'
import ButtonLoading from '@/components/application/ButtonLoading'

const page = () => {
    const params = useParams()
    const searchParams = useSearchParams().toString()
    const webLabel = params.category
    const label = webLabel.charAt(0).toUpperCase() + webLabel.slice(1)
    const windowSize = useWindowSize()

    const [limit, setLimit] = useState(30)
    const [sorting, setSorting] = useState("default_sorting")
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [isMobileFilter, setisMobileFilter] = useState(false)

    const breadCrumbData = [
        { href: WEBSITE_HOME, label: 'Home' },
        { href: WEBSITE_CATEGORY(`${label}`), label: `${label}` },
    ]

    // const fetchListing = async (pageParam) => {
    //     const { data: getListing } = await axios.get(`/api/website/listings?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`)
    //     if (!getListing) return
    //     return getListing.data
    // }
    const fetchListing = async (pageParam) => {
        const { data: getListing } = await axios.get(
            `/api/website/listings?category=${webLabel}&page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`
        )
        return getListing?.data
    }


    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['listings', limit, sorting, searchParams],
        queryFn: async ({ pageParam }) => await fetchListing(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage
        }
    })
    return (
        <div className='lg:px-16 px-4 mt-10'>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <section className='lg:flex my-5'>
                {windowSize.width > 1024 ?
                    <div className='w-72 me-4'>
                        <div className='sticky top-0 bg-pink-50 p-4 rounded-md'>
                            <Filter />
                        </div>
                    </div>
                    :

                    <Sheet open={isMobileFilter} onOpenChange={() => setisMobileFilter(false)}>
                        <SheetContent side='left' className='block'>
                            <SheetHeader className='gap-0 m-0'>
                                <SheetTitle>Filter</SheetTitle>
                            </SheetHeader>
                            <div className='m-0 px-5 h-[calc(100vh-80px)]'>
                                <Filter />
                            </div>
                        </SheetContent>
                    </Sheet>
                }

                <div className='lg:w-[calc(100%-18rem)] '>
                    <Sorting
                        limit={limit}
                        setLimit={setLimit}
                        sorting={sorting}
                        setSorting={setSorting}
                        mobileFilterOpen={isMobileFilter}
                        setMobileFilterOpen={setisMobileFilter}
                    />

                    {isFetching && <div className='text-center my-auto '>Loading...</div>}
                    {error && <div className='w-screen h-screen items-center justify-center flex '>{error.message}</div>}

                    <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-5 mt-5'>
                        {data && data.pages.map(page => (
                            page.listings.map((listing, index) => (
                                <ListingBox key={index} listing={listing} />
                            ))
                        ))}
                    </div>

                    {/* LOAD MORE */}
                    <div className='flex justify-center mt-10'>
                        {hasNextPage ?
                            <ButtonLoading type='button' loading={isFetching} text={'Load more'} onClick={fetchNextPage} />
                            :
                            <>
                                {!isFetching && <span>{"You're all caught up"}</span>}
                            </>
                        }
                    </div>

                </div>
            </section>
        </div>
    )
}

export default page
