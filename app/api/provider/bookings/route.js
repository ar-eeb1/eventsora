import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { NextResponse } from "next/server";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated(['provider'])
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
        const bookingStatus = searchParams.get('bookingStatus')

        // matchquery
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);

        // Find all listings owned by this provider
        const providerListings = await ListingModel.find({ userId: userObjectId }).select('_id').lean();
        const listingIds = providerListings.map(l => l._id);

        let matchQuery = {
            $or: [
                { providerId: userObjectId },
                { 'listings.listingId': { $in: listingIds } }
            ]
        };

        if (bookingStatus) {
            matchQuery.bookingStatus = bookingStatus
        }

        if (deleteType === 'SD') {
            matchQuery.deletedAt = null
        } else if (deleteType === 'PD') {
            matchQuery.deletedAt = { $ne: null }
        }


        //global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { booking_id: { $regex: globalFilter, $options: 'i' } },
                { name: { $regex: globalFilter, $options: 'i' } },
                { email: { $regex: globalFilter, $options: 'i' } },
                { phone: { $regex: globalFilter, $options: 'i' } },
                { bookingStatus: { $regex: globalFilter, $options: 'i' } },
                { 'listings.name': { $regex: globalFilter, $options: 'i' } },
                { paymentStatus: { $regex: globalFilter, $options: 'i' } },
                { bookingStatus: { $regex: globalFilter, $options: 'i' } }
            ]

            // If globalFilter is a number, also search in totalAmount
            if (!isNaN(globalFilter) && globalFilter !== '') {
                matchQuery['$or'].push({ totalAmount: Number(globalFilter) })
            }
        }

        // column filteration
        filters.forEach(filter => {
            if (filter.id === 'totalAmount' || filter.id === 'subtotal') {
                if (!isNaN(filter.value) && filter.value !== '') {
                    matchQuery[filter.id] = Number(filter.value)
                }
            } else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
        });

        //sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        // SECURITY: Force listing ownership match to prevent any bypass
        matchQuery['listings.listingId'] = { $in: listingIds };

        //agggreggate pipeline
        const aggregatePipeline = [
            { $match: matchQuery },
            {
                $addFields: {
                    // Filter listings to only include this provider's listings
                    providerListings: {
                        $filter: {
                            input: "$listings",
                            as: "item",
                            cond: { $in: ["$$item.listingId", listingIds] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    // Calculate subtotal for these specific listings
                    subtotal: {
                        $reduce: {
                            input: "$providerListings",
                            initialValue: 0,
                            in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    _id: { $toString: "$_id" }
                }
            },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },

        ]

        //execute query
        const getBookings = await bookingModel.aggregate(aggregatePipeline)

        // get total row count
        const totalRowCount = await bookingModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getBookings,
            meta: { totalRowCount }
        })


    } catch (error) {
        return catchError(error)
    }
}