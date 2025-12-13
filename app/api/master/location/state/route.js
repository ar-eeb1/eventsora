import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CountryModel from "@/models/Country.model";
import StateModel from "@/models/State.model";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const searchParams = request.nextUrl.searchParams

        // extract query parameters
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType') || ""

        // matchquery
        let matchQuery = {}
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        //global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { state: { $regex: globalFilter, $options: 'i' } },
                { country: { $regex: globalFilter, $options: 'i' } },
            ]
        }

        //column filter
        filters.forEach(filter => {
            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
        });

        //sortingg
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        //agggreggate pipeline
        const aggregatePipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'country',
                    foreignField: '_id',
                    as: 'countryData'
                }
            },
            {
                $unwind: {
                    path: '$countryData',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    state: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,

                    country: "$countryData.country",
                    countryId: "$countryData._id"
                }
            }
        ]

        //execute query
        const getState = await StateModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await StateModel.countDocuments(matchQuery)

        return NextResponse.json({
            data: getState,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}