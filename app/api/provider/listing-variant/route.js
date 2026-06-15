import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { NextResponse } from "next/server";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated(['master', 'provider'])
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
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        let matchQuery = {
            userId: userObjectId
        };

        if (deleteType === 'SD') {
            matchQuery.deletedAt = null
        } else if (deleteType === 'PD') {
            matchQuery.deletedAt = { $ne: null }
        }


        //global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { "listingData.name": { $regex: globalFilter, $options: 'i' } },
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
                    from: 'listings',
                    localField: 'listingId',
                    foreignField: '_id',
                    as: 'listingData'
                }
            },
            {
                $unwind: {
                    path: '$listingData', preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    listing: "$listingData.name",
                    listingId: 1,
                    title: 1,
                    serviceCode: 1,
                    startingPrice: 1,
                    pricingType: 1,
                    status: 1,
                    media: 1,
                    deletedAt: 1,
                }
            }
        ]

        //execute query
        const getListingVariant = await ListingVariantModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await ListingVariantModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getListingVariant,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}