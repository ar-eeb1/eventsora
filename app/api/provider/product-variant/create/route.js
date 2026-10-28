import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
import MediaModel from '@/models/Media.model'
import { productVariantBatchSchema, productVariantSchema } from '@/lib/zodSchema'

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const payload = await request.json()

        if (Array.isArray(payload.variants)) {
            const validation = productVariantBatchSchema.safeParse(payload)
            if (!validation.success) return response(false, 400, 'Invalid or missing variant fields.', validation.error)
            const { productId, variants } = validation.data
            const mediaIds = [...new Set(variants.flatMap((variant) => variant.media))]
            if (![productId, ...mediaIds].every((id) => mongoose.isValidObjectId(id))) {
                return response(false, 400, 'Invalid product or media reference.')
            }

            const skus = variants.map((variant) => variant.sku.trim().toUpperCase())
            if (new Set(skus).size !== skus.length) {
                return response(false, 409, 'Each option combination must have a unique SKU.')
            }

            await connectDB()
            const product = await ProductModel.findOne({ _id: productId, userId: auth.userId, deletedAt: null }).lean()
            if (!product) return response(false, 403, 'Product not found or access denied.')
            const mediaCount = await MediaModel.countDocuments({
                _id: { $in: mediaIds },
                userId: auth.userId,
                deletedAt: null,
            })
            if (mediaCount !== mediaIds.length) {
                return response(false, 400, 'One or more selected images are unavailable.')
            }
            const duplicate = await ProductVariantModel.findOne({ sku: { $in: skus } }).lean()
            if (duplicate) return response(false, 409, 'A variant with this SKU already exists.')

            const combinationKey = (name, attributes = {}) => JSON.stringify([
                name.trim().toLowerCase(),
                attributes.size?.trim().toLowerCase() || '',
                attributes.color?.trim().toLowerCase() || '',
            ])
            const requestedCombinations = variants.map((variant) => combinationKey(variant.name, variant.attributes))
            if (new Set(requestedCombinations).size !== requestedCombinations.length) {
                return response(false, 409, 'Each option combination must be unique.')
            }
            const existingVariants = await ProductVariantModel.find({
                product: productId,
                name: { $in: [...new Set(variants.map((variant) => variant.name))] },
                deletedAt: null,
            }).select('name attributes').lean()
            const existingCombinations = new Set(existingVariants.map((variant) => combinationKey(variant.name, variant.attributes)))
            if (requestedCombinations.some((key) => existingCombinations.has(key))) {
                return response(false, 409, 'One or more option combinations already exist for this variant name.')
            }

            await ProductVariantModel.insertMany(variants.map((variant, index) => ({
                ...variant,
                sku: skus[index],
                product: productId,
                stockQuantity: variant.stockType === 'in_stock' ? variant.stockQuantity : 0,
            })))
            return response(true, 200, 'Product variants added.')
        }

        const validation = productVariantSchema.safeParse(payload)
        if (!validation.success) return response(false, 400, 'Invalid or missing variant fields.', validation.error)
        const data = validation.data
        if (![data.productId, ...data.media].every((id) => mongoose.isValidObjectId(id))) {
            return response(false, 400, 'Invalid product or media reference.')
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
        const duplicate = await ProductVariantModel.findOne({ sku: data.sku }).lean()
        if (duplicate) return response(false, 409, 'A variant with this SKU already exists.')

        const { productId, ...variantData } = data
        await ProductVariantModel.create({ ...variantData, product: productId, stockQuantity: data.stockType === 'in_stock' ? data.stockQuantity : 0 })
        return response(true, 200, 'Product variant added.')
    } catch (error) {
        return catchError(error)
    }
}
