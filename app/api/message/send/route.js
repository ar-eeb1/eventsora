import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import MessageModel from "@/models/Message.model";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['user', 'provider', 'admin'])

        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        const { conversationId, text } = await request.json()
        if (!isValidObjectId(conversationId)) {
            return response(false, 400, 'Invalid Conversation ID')
        }

        if (!text || text.trim() === '') {
            return response(false, 400, 'Empty Message')
        }

        await connectDB()

        //CREATE MESSAGE
        const newMessage = await MessageModel.create({
            conversationId,
            sender: auth.userId,
            text,
            readBy: []
        })

        //UPDATE THE CONVERSATION WITH THE LAST MESSAGE
        await ConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastMessageBy: auth.userId,
            isRead: false
        })

        return response(true, 200, 'Message Sent', newMessage)
    } catch (error) {
        return catchError(error)
    }
}