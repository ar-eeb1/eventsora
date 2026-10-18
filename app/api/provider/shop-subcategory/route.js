import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

        const categoryId = request.nextUrl.searchParams.get('categoryId')
        await connectDB()
        const filter = { deletedAt: null }
        if (categoryId) filter.shopCategory = categoryId

        const subcategories = await ShopSubcategoryModel.find(filter)
            .select('_id shopSubCategory shopCategory')
            .sort({ shopSubCategory: 1 })
            .lean()

        return response(true, 200, 'Subcategories found.', subcategories)
    } catch (error) {
        return catchError(error)
    }
}