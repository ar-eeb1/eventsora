import axios from 'axios'
import React from 'react'
import ListingDetails from './ListingDetails'

const ListingPage = async ({ params, searchParams }) => {
    const { slug } = await params
    const { capacity, startingPrice } = await searchParams

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/website/details/${slug}`

    if (startingPrice && capacity) {
        url += `?startingPrice=${startingPrice}&capacity=${capacity}`
    }
    const { data: getListing } = await axios.get(url)
    

    if (!getListing.success) {
        return (
            <div className='flex justify-center items-center py-10 h-75'>
                <h1 className='text-4xl font-semibold'>
                    Data not found
                </h1>
            </div>
        )
    } else {
        return (
            <ListingDetails
                listing={getListing?.data?.listing}
                variants={getListing?.data?.variant}
                startingPrice={getListing?.data?.startingPrice}
                capacity={getListing?.data?.capacity}
                reviewCount={getListing?.data?.reviewCount}
            />
        )
    }
}

export default ListingPage
