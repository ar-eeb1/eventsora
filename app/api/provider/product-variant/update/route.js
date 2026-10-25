import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
import MediaModel from '@/models/Media.model'
import { productVariantSchema } from '@/lib/zodSchema'

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const validation = productVariantSchema.safeParse(await request.json())
        if (!validation.success) return response(false, 400, 'Invalid or missing variant fields.', validation.error)
        const data = validation.data
        if (!data._id || ![data._id, data.productId, ...data.media].every((id) => mongoose.isValidObjectId(id))) {
            return response(false, 400, 'Invalid variant, product, or media reference.')
        }

        await connectDB()
        const product = await ProductModel.findOne({ _id: data.productId, userId: auth.userId, deletedAt: null }).lean()
        if (!product) return response(false, 403, 'Product not found or access denied.')
        const mediaCount = await MediaModel.countDocuments({
            _id: { $in: data.media },
            userId: auth.userId,
            deletedAt: null,
        })
        if (mediaCount !== data.media.length) {
            return response(false, 400, 'One or more selected images are unavailable.')
        }
        const variant = await ProductVariantModel.findOne({ _id: data._id, product: { $in: [product._id] }, deletedAt: null })
        if (!variant) return response(false, 404, 'Product variant not found or access denied.')
        const duplicate = await ProductVariantModel.findOne({ _id: { $ne: data._id }, sku: data.sku }).lean()
        if (duplicate) return response(false, 409, 'A variant with this SKU already exists.')

        const { _id, productId, ...variantData } = data
        Object.assign(variant, variantData, { product: productId, stockQuantity: data.stockType === 'in_stock' ? data.stockQuantity : 0 })
        await variant.save()
        return response(true, 200, 'Product variant updated.')
    } catch (error) {
        return catchError(error)
    }
}
