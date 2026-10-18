import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ConversationModel from "@/models/Conversation.model";
import ProductModel from "@/models/Product.Model";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['user', 'provider'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        const { receiverId: requestedReceiverId, listingId, productId } = await request.json()
        if ([listingId, productId].filter(Boolean).length !== 1) {
            return response(false, 400, 'Provide exactly one listing or product.')
        }
        const targetId = listingId || productId
        if (!isValidObjectId(targetId)) return response(false, 400, 'Invalid listing or product ID.')
        await connectDB()

        let receiverId = requestedReceiverId
        if (productId) {
            const product = await ProductModel.findOne({ _id: productId, status: 'approved', deletedAt: null }).select('userId').lean()
            if (!product) return response(false, 404, 'Product not found.')
            receiverId = String(product.userId)
        }
        if (!isValidObjectId(receiverId)) return response(false, 400, 'Invalid Receiver ID')
        if (String(auth.userId) === String(receiverId)) return response(false, 400, 'You cannot message yourself')

        let conversation = await ConversationModel.findOne({
            participants: {
                $all: [auth.userId, receiverId]
            },
            listingId: listingId || null,
            productId: productId || null,
        })

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [auth.userId, receiverId],
                listingId: listingId || null,
                productId: productId || null,
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