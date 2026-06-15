import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB()
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page'), 10) || 0
        const limit = parseInt(searchParams.get('limit'), 10) || 0
        const deleteType = searchParams.get('deleteType')
        const userId = searchParams.get('userId')

        let filter = {};

        if (userId) {
            filter.userId = userId;
        } else {
            const auth = await isAuthenticated('provider')
            if (!auth.isAuth) {
                return response(false, 403, 'Unauthorized,')
            }
            filter.userId = auth.userId;
        }

        if (deleteType === 'SD') {
            filter.deletedAt = null;
        } else if (deleteType === 'PD') {
            filter.deletedAt = { $ne: null };
        }


        const mediaData = await MediaModel.find(filter).sort({ createdAt: -1 }).skip(page * limit).limit(limit).lean()
        const totalMedia = await MediaModel.countDocuments(filter)

        return NextResponse.json({
            mediaData: mediaData,
            hasMore: (page + 1) * limit < totalMedia
        })
    } catch (error) {
        return catchError(error)
    }
}