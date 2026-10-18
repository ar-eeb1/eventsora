import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import MessageModel from "@/models/Message.model";
import UserModel from "@/models/User.model";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import { isValidObjectId } from "mongoose";
import { emitSocketEvent } from "@/lib/socket";

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

        // Broadcast the populated message through the backend Socket.IO server.
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

            await emitSocketEvent('message:new', {
                conversationId,
                message: populatedMessage,
            })

            const conversation = await ConversationModel.findById(conversationId)
            if (conversation) {
                await Promise.all(conversation.participants.map(async (participantId) => {
                    if (participantId.toString() !== auth.userId) {
                        await emitSocketEvent('conversation:update', {
                            userId: participantId.toString(),
                            data: {
                                conversationId,
                                lastMessage: text,
                                updatedAt: new Date(),
                                isRead: false
                            }
                        })
                    }
                }))
            }
        } catch (err) {
            console.error('Socket.IO broadcast error:', err)
        }

        return response(true, 200, 'Message Sent', newMessage)
    } catch (error) {
        return catchError(error)
    }
}