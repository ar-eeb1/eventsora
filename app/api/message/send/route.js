import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import MessageModel from "@/models/Message.model";
import { isValidObjectId } from "mongoose";
import { pusherServer } from "@/lib/pusher";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['user', 'provider', 'admin'])

        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        const { conversationId, text, isQuote, quotePrice, quoteListingId, quoteVariantId, quoteDate } = await request.json()
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
            isQuote: isQuote || false,
            quotePrice: quotePrice || null,
            quoteListingId: quoteListingId || null,
            quoteVariantId: quoteVariantId || null,
            quoteDate: quoteDate || null,
            readBy: []
        })

        //UPDATE THE CONVERSATION WITH THE LAST MESSAGE
        await ConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastMessageBy: auth.userId,
            isRead: false
        })

        // TRIGGER PUSHER EVENT
        try {
            const populatedMessage = await MessageModel.findById(newMessage._id)
                .populate('sender', 'name email profileImage')
                .populate({
                    path: 'quoteListingId',
                    populate: [
                        { path: 'category', select: 'category' },
                        { path: 'subcategory', select: 'subcategory' },
                        { path: 'media' }
                    ]
                })
                .populate('quoteVariantId')

            await pusherServer.trigger(`chat-${conversationId}`, 'new-message', populatedMessage)

            // TRIGGER SIDEBAR UPDATE FOR ALL PARTICIPANTS
            const conversation = await ConversationModel.findById(conversationId)
            if (conversation) {
                conversation.participants.forEach((participantId) => {
                    // Send to everyone EXCEPT the sender (they already have the message)
                    if (participantId.toString() !== auth.userId) {
                        pusherServer.trigger(`user-${participantId}`, 'conversation-update', {
                            conversationId,
                            lastMessage: text,
                            updatedAt: new Date(),
                            isRead: false
                        })
                    }
                })
            }
        } catch (err) {
            console.error('Pusher Trigger Error:', err)
        }

        return response(true, 200, 'Message Sent', newMessage)
    } catch (error) {
        return catchError(error)
    }
}