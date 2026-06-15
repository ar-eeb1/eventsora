import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated(['provider']);
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });

        const upcoming = await BookingModel.aggregate([
            {
                $match: {
                    providerId: userObjectId,
                    deletedAt: null,
                    bookingStatus: { $nin: ['cancelled', 'completed'] }
                }
            },
            {
                $addFields: {
                    earliestDate: {
                        $min: {
                            $reduce: {
                                input: '$listings',
                                initialValue: [],
                                in: { $concatArrays: ['$$value', '$$this.bookingDate'] }
                            }
                        }
                    }
                }
            },
            { $match: { earliestDate: { $gte: todayStr } } },
            { $sort: { earliestDate: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'listings',
                    localField: 'listings.listingId',
                    foreignField: '_id',
                    as: 'listingInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    booking_id: 1,
                    name: 1,
                    phone: 1,
                    eventType: 1,
                    totalAmount: 1,
                    receivedAmount: 1,
                    advance: 1,
                    bookingStatus: 1,
                    earliestDate: 1,
                    listingName: { $arrayElemAt: ['$listings.name', 0] },
                    variantTitle: { $arrayElemAt: ['$listings.variantTitle', 0] },
                    mediaIds: { $arrayElemAt: ['$listingInfo.media', 0] }
                }
            }
        ]);

        // Fetch first media URL for each
        for (const evt of upcoming) {
            if (evt.mediaIds?.length) {
                const firstMedia = await MediaModel.findById(evt.mediaIds[0]).select('secure_url').lean()
                evt.mediaUrl = firstMedia?.secure_url || null
            } else {
                evt.mediaUrl = null
            }
        }

        return response(true, 200, 'Upcoming Events', upcoming);
    } catch (error) {
        return catchError(error);
    }
}
