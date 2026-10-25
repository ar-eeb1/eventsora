import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductVariantModel from '@/models/ProductVariant.Model'

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const { id } = await params
        if (!mongoose.isValidObjectId(id)) return response(false, 400, 'Invalid variant id.')
        await connectDB()
        const variant = await ProductVariantModel.findOne({ _id: id, deletedAt: null })
            .populate({ path: 'product', match: { userId: auth.userId, deletedAt: null }, select: '_id name' })
            .populate('media', '_id secure_url thumbnail_url alt url')
            .lean()
        if (!variant?.product) return response(false, 404, 'Product variant not found.')
        return response(true, 200, 'Product variant found.', { ...variant, productId: variant.product._id })
    } catch (error) {
        return catchError(error)
    }
}
