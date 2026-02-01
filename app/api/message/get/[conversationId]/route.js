import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MessageModel from "@/models/Message.model";
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

        return response(true, 200, 'Message fetched', messages)
    } catch (error) {
        return catchError(error)
    }
}