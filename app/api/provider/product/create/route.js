import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import { productSchema } from '@/lib/zodSchema'
import { isValidObjectId } from 'mongoose'

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

        const validation = productSchema.safeParse(await request.json())
        if (!validation.success) {
            return response(false, 400, 'Invalid or missing product fields.', validation.error)
        }

        const productData = validation.data
        if (![productData.category,
        productData.subcategory, 
        productData.country, 
        productData.state, 
        productData.city, ...productData.media].every(isValidObjectId)) {
            return response(false, 400, 'Invalid product reference.')
        }

        await connectDB()
        const duplicate = await ProductModel.findOne({
            $or: [{ slug: productData.slug }, { sku: productData.sku }],
        }).lean()

        if (duplicate) return response(false, 409, 'A product with this slug or SKU already exists.')

        await ProductModel.create({ ...productData, userId: auth.userId })
        return response(true, 200, 'Product added.')
    } catch (error) {
        return catchError(error)
    }
}