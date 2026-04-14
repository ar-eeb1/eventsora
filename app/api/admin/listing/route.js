import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const searchParams = request.nextUrl.searchParams

        // extract query parameter
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || "[]")
        const globalFilter = searchParams.get('globalFilter') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || "[]")
        const deleteType = searchParams.get('deleteType')

        // matchquery
        let matchQuery = {};
        
        if (deleteType === 'SD') {
            matchQuery.deletedAt = null
        } else if (deleteType === 'PD') {
            matchQuery.deletedAt = { $ne: null }
        }


        //global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { "categoryData.category": { $regex: globalFilter, $options: 'i' } },
                { "subcategoryData.subcategory": { $regex: globalFilter, $options: 'i' } },
                { "cityData.city": { $regex: globalFilter, $options: 'i' } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$startingPrice' },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
            ]
        }

        // column filteration
        filters.forEach(filter => {
            if (filter.id === 'startingPrice') {
                matchQuery[filter.id] = Number(filter.value)
            } else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
        });

        //sortingg
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        //agggreggate pipeline
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $unwind: {
                    path: '$categoryData', preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            {
                $unwind: {
                    path: '$subcategoryData', preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'cityData'
                }
            },
            {
                $unwind: {
                    path: '$cityData', preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    category: "$categoryData.category",
                    subcategory: "$subcategoryData.subcategory",
                    startingPrice: 1,
                    userId: 1,
                    media: 1,
                    description: 1,
                    country: 1,
                    state: 1,
                    city: "$cityData.city",
                    locality: 1,
                    sublocality: 1,
                    address: 1,
                    capacity: 1,
                    status: 1,
                    deletedAt: 1,
                    tags: 1,
                }
            }
        ]

        //execute query
        const getListing = await ListingModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await ListingModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getListing,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}