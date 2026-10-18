import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import { productSchema } from '@/lib/zodSchema'

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

        const validation = productSchema.safeParse(await request.json())
        if (!validation.success) return response(false, 400, 'Invalid or missing product fields.', validation.error)

        await connectDB()
        const data = validation.data
        if (!data._id || ![data._id, data.category, data.subcategory, data.country, data.state, data.city, ...data.media].every(mongoose.isValidObjectId)) {
            return response(false, 400, 'Invalid product reference.')
        }
        const product = await ProductModel.findOne({ _id: data._id, userId: auth.userId, deletedAt: null })
        if (!product) return response(false, 404, 'Product not found or access denied.')

        const duplicate = await ProductModel.findOne({
            _id: { $ne: data._id },
            $or: [{ slug: data.slug }, { sku: data.sku }],
        }).lean()
        if (duplicate) return response(false, 409, 'A product with this slug or SKU already exists.')

        Object.assign(product, data)
        await product.save()
        return response(true, 200, 'Product updated.')
    } catch (error) {
        return catchError(error)
    }
}