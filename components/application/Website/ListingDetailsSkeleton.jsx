import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ListingDetailsSkeleton = () => {
    return (
        <div className='lg:px-32 px-4 mt-10 animate-pulse'>
            {/* Breadcrumb Skeleton */}
            <div className='flex gap-2 mb-10'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-32' />
            </div>

            <div className='md:flex justify-between items-start lg:gap-10 gap-5 mb-20'>
                {/* Image Gallery Skeleton */}
                <div className='md:w-1/2 xl:flex xl:justify-center xl:gap-5'>
                    <div className='xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]'>
                        <Skeleton className='aspect-square w-full rounded-md' />
                    </div>
                    <div className='flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto'>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className='md:w-full w-16 aspect-square rounded-md shrink-0' />
                        ))}
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className='md:w-1/2 md:mt-0 mt-5 space-y-6'>
                    <div className="flex items-start justify-between flex-wrap gap-2">
                        <Skeleton className='h-10 w-3/4' />
                        <div className="flex gap-2">
                            <Skeleton className='h-6 w-24 rounded-full' />
                            <Skeleton className='h-6 w-24 rounded-full' />
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-5 w-24' />
                    </div>

                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-5 w-48' />
                    </div>

                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-10 w-64' />
                    </div>

                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-2/3' />
                    </div>

                    <div className='flex gap-4'>
                        <Skeleton className='h-12 w-32 rounded-full' />
                        <Skeleton className='h-12 w-32 rounded-full' />
                        <Skeleton className='h-12 w-32 rounded-full' />
                    </div>

                    <div className='pt-10 space-y-4'>
                        <Skeleton className='h-14 w-full rounded-full' />
                        <div className='flex gap-4'>
                            <Skeleton className='h-14 w-1/2 rounded-full' />
                            <Skeleton className='h-14 w-1/2 rounded-full' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Section Skeleton */}
            <div className='mb-20 space-y-8'>
                <div className='flex flex-col items-center space-y-4'>
                    <Skeleton className='h-1 w-20 rounded-full' />
                    <Skeleton className='h-10 w-1/2' />
                    <Skeleton className='h-5 w-1/3' />
                </div>
                <Skeleton className='h-[400px] w-full rounded-xl' />
            </div>

            {/* Details Section Skeleton */}
            <div className='mb-10 p-6 border rounded-xl space-y-4'>
                <Skeleton className='h-8 w-48' />
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                </div>
            </div>
        </div>
    )
}

export default ListingDetailsSkeleton
