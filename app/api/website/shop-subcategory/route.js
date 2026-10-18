import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'

export async function GET() {
    try {
        await connectDB()

        const activeSubcategoryIds = await ProductModel.distinct('subcategory', {
            status: 'approved',
            deletedAt: null,
        })
        const subcategories = await ShopSubcategoryModel.find({
            _id: { $in: activeSubcategoryIds },
            deletedAt: null,
        }).select('_id shopSubCategory slug shopCategory').sort({ shopSubCategory: 1 }).lean()

        return response(true, 200, 'Shop subcategories fetched', subcategories)
    } catch (error) {
        return catchError(error)
    }
}