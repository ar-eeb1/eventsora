import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ShopCategoryModel from '@/models/ShopCategory.model'

export async function GET() {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

        await connectDB()
        const categories = await ShopCategoryModel.find({ deletedAt: null })
            .select('_id category')
            .sort({ category: 1 })
            .lean()

        return response(true, 200, 'Categories found.', categories)
    } catch (error) {
        return catchError(error)
    }
}