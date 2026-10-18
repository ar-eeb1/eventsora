import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
import { productVariantSchema } from '@/lib/zodSchema'

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const payload = await request.json()
        const validation = productVariantSchema.safeParse(payload)
        if (!validation.success) return response(false, 400, 'Invalid or missing variant fields.', validation.error)
        const data = validation.data
        if (!mongoose.isValidObjectId(data.productId)) return response(false, 400, 'Invalid product reference.')

        await connectDB()
        const product = await ProductModel.findOne({ _id: data.productId, userId: auth.userId, deletedAt: null }).lean()
        if (!product) return response(false, 403, 'Product not found or access denied.')
        const duplicate = await ProductVariantModel.findOne({ sku: data.sku }).lean()
        if (duplicate) return response(false, 409, 'A variant with this SKU already exists.')

        const { productId, ...variantData } = data
        await ProductVariantModel.create({ ...variantData, product: productId, stockQuantity: data.stockType === 'in_stock' ? data.stockQuantity : 0 })
        return response(true, 200, 'Product variant added.')
    } catch (error) {
        return catchError(error)
    }
}
