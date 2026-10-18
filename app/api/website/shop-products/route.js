import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ShopCategoryModel from '@/models/ShopCategory.model'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'
import '@/models/Media.model'

export async function GET(request) {
    try {
        await connectDB()
        const params = request.nextUrl.searchParams
        const categorySlug = params.get('category')
        const subcategorySlugs = (params.get('subcategory') || '').split(',').filter(Boolean)
        const minPrice = params.has('minPrice') ? Number(params.get('minPrice')) : null
        const maxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : null

        if (!categorySlug) return response(false, 400, 'Category is required')
        if ((minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) ||
            (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
            (minPrice !== null && maxPrice !== null && minPrice > maxPrice)) {
            return response(false, 400, 'Invalid price range')
        }

        const category = await ShopCategoryModel.findOne({ slug: categorySlug, deletedAt: null }).select('_id').lean()
        if (!category) return response(false, 404, 'Category not found')

        const filter = { category: category._id, status: 'approved', deletedAt: null }
        if (subcategorySlugs.length) {
            const subcategories = await ShopSubcategoryModel.find({
                slug: { $in: subcategorySlugs },
                shopCategory: category._id,
                deletedAt: null,
            }).select('_id').lean()
            if (subcategories.length !== new Set(subcategorySlugs).size) return response(true, 200, 'Shop products fetched', [])
            filter.subcategory = { $in: subcategories.map((subcategory) => subcategory._id) }
        }
        if (minPrice !== null || maxPrice !== null) {
            filter.price = {}
            if (minPrice !== null) filter.price.$gte = minPrice
            if (maxPrice !== null) filter.price.$lte = maxPrice
        }

        const products = await ProductModel.find(filter)
            .populate('media', '_id secure_url thumbnail_url alt')
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(100)
            .lean()

        return response(true, 200, 'Shop products fetched', products)
    } catch (error) {
        return catchError(error)
    }
}