import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import LocalityModel from "@/models/Locality.model";
import SublocalityModel from "@/models/Sublocality.model";
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
                { locality: { $regex: globalFilter, $options: 'i' } },
                { sublocality: { $regex: globalFilter, $options: 'i' } }
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
                    from: 'localities',
                    localField: 'locality',
                    foreignField: '_id',
                    as: 'localityData'
                }
            },
            {
                $unwind: {
                    path: '$localityData',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    sublocality: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,

                    locality: "$localityData.locality",
                    localityId: "$localityData._id"
                }
            }
        ]

        //execute query
        const getLocality = await SublocalityModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await SublocalityModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getLocality,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}