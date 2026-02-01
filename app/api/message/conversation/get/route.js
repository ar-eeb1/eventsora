import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated(['user', 'provider', 'admin'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()

        const conversations = await ConversationModel.find({
            participants: {
                $in: [auth.userId]
            }
        }).populate('participants', 'name email profileImage')
            .populate('listingId', 'name slug media')
            .sort({ updatedAt: -1 })
            .lean()

        return response(true, 200, 'Conversations fetched', conversations)
    } catch (error) {
        return catchError(error)
    }
}