import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CityModel from "@/models/City.model";
import CountryModel from "@/models/Country.model";
import LocalityModel from "@/models/Locality.model";
import StateModel from "@/models/State.model";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const auth = await isAuthenticated(['master', 'provider', 'admin'])
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
                { city: { $regex: globalFilter, $options: 'i' } },
                { locality: { $regex: globalFilter, $options: 'i' } }
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
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'cityData'
                }
            },
            {
                $unwind: {
                    path: '$cityData',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    locality: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,

                    city: "$cityData.city",
                    cityId: "$cityData._id"
                }
            }
        ]

        //execute query
        const getCity = await LocalityModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await LocalityModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getCity,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}