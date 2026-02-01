import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import MessageModel from "@/models/Message.model";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['provider', 'user', 'master'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const { conversationId } = await request.json()

        if (!conversationId) {
            return response(false, 400, 'Conversation ID is required')
        }

        // 1. Update Messages: Add user to readBy array if not already present
        // We update all messages in this conversation where the user is NOT the sender
        await MessageModel.updateMany(
            {
                conversationId: conversationId,
                sender: { $ne: auth.userId },
                readBy: { $ne: auth.userId }
            },
            {
                $addToSet: { readBy: auth.userId }
            }
        )

        // 2. Update Conversation:
        // If the last message was NOT sent by the current user, then the conversation is now "read" for them.
        // However, `isRead` is a simplistic boolean on the Conversation model.
        // Usually `isRead` implies "Is read by the recipient of the last message".
        // If I am the recipient, and I'm reading it, I should set isRead to true.

        const conversation = await ConversationModel.findById(conversationId)

        if (conversation && conversation.lastMessageBy?.toString() !== auth.userId) {
            conversation.isRead = true
            await conversation.save()
        }

        return response(true, 200, 'Messages marked as read')

    } catch (error) {
        return catchError(error)
    }
}
