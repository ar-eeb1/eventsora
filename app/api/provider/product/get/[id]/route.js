import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

        const { id } = await params
        if (!mongoose.isValidObjectId(id)) return response(false, 400, 'Invalid product id.')

        await connectDB()
        const product = await ProductModel.findOne({ _id: id, userId: auth.userId, deletedAt: null })
            .populate('media', '_id secure_url url')
            .lean()

        if (!product) return response(false, 404, 'Product not found.')
        return response(true, 200, 'Product found.', product)
    } catch (error) {
        return catchError(error)
    }
}
