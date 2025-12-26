import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import reviewModel from "@/models/Review.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const searchParams = request.nextUrl.searchParams

        // Extract query paramters
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilter') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType')

        // Build match query
        let matchQuery = {}
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        //global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { "listingData.name": { $regex: globalFilter, $options: 'i' } },
                { "userData.name": { $regex: globalFilter, $options: 'i' } },
                { rating: { $regex: globalFilter, $options: 'i' } },
                { title: { $regex: globalFilter, $options: 'i' } },
                { review: { $regex: globalFilter, $options: 'i' } },
            ]
        }

        // Column filteration
        filters.forEach(filter => {
            if (filter.id === 'listing') {
                matchQuery['listingData.name'] = { $regex: filter.value, $options: 'i' }
            } else if (filter.id === 'user') {
                matchQuery['userData.name'] = { $regex: filter.value, $options: 'i' }
            } else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
        });

        // sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })


        // Aggregate Pipeline
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'listings',
                    localField: 'listing',
                    foreignField: '_id',
                    as: 'listingData'
                }
            },
            {
                $unwind: {
                    path: '$listingData', preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: '$userData', preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    user: '$userData.name',
                    listing: '$listingData.name',
                    rating: 1,
                    review: 1,
                    title: 1,
                    updatedAt: 1,
                    createdAt: 1,
                    deletedAt: 1,
                }
            }
        ]

        //execute query
        const getReview = await reviewModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await reviewModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getReview,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}