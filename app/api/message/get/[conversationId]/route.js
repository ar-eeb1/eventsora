import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MessageModel from "@/models/Message.model";
import UserModel from "@/models/User.model";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {

    try {
        const auth = await isAuthenticated(['user', 'provider', 'admin'])

        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        const { conversationId } = await params
        if (!isValidObjectId(conversationId)) {
            return response(false, 400, 'Invalid Conversation ID')
        }

        await connectDB()

        const messages = await MessageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name email profileImage')
            .populate('readBy', 'name')
            .populate({
                path: 'quoteListingId',
                populate: [
                    { path: 'category', select: 'category' },
                    { path: 'subcategory', select: 'subcategory' },
                    { path: 'media' }
                ]
            })
            .populate('quoteVariantId')

        return response(true, 200, 'Message fetched', messages)
    } catch (error) {
        return catchError(error)
    }
}