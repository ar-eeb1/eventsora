import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['user', 'provider'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        const { receiverId, listingId } = await request.json()
        if (!isValidObjectId(receiverId)) {
            return response(false, 400, 'Invalid Receiver ID')
        }
        if (!isValidObjectId(listingId)) {
            return response(false, 400, 'Invalid Listing ID')
        }

        if (auth.userId === receiverId) {
            return response(false, 400, "You cannot message yourself")
        }

        await connectDB()

        let conversation = await ConversationModel.findOne({
            participants: {
                $all: [auth.userId, receiverId]
            },
            listingId: listingId
        })

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [auth.userId, receiverId],
                listingId: listingId,
                lastMessage: 'Started conversation',
                lastMessageBy: auth.userId,
                isRead: false
            })
        }
        return response(true, 200, 'Conversation Ready', conversation)
    } catch (error) {
        return catchError(error)
    }
}