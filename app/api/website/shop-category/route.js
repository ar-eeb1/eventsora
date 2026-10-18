import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ShopCategoryModel from '@/models/ShopCategory.model'

export async function GET() {
    try {
        await connectDB()

        const activeCategoryIds = await ProductModel.distinct('category', {
            status: 'approved',
            deletedAt: null,
        })
        const categories = await ShopCategoryModel.find({
            _id: { $in: activeCategoryIds },
            deletedAt: null,
        }).sort({ category: 1 }).lean()

        return response(true, 200, 'Shop categories fetched', categories)
    } catch (error) {
        return catchError(error)
    }
}