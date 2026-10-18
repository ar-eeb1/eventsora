import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
import ReviewModel from '@/models/Review.model'
import ShopCategoryModel from '@/models/ShopCategory.model'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'
import '@/models/Media.model'
import '@/models/User.model'

export async function GET(request, { params }) {
    try {
        await connectDB()
        const { slug } = await params
        const categorySlug = request.nextUrl.searchParams.get('category')
        if (!categorySlug) return response(false, 400, 'Category is required')

        const product = await ProductModel.findOne({ slug, status: 'approved', deletedAt: null })
            .populate('media', '_id secure_url thumbnail_url alt')
            .populate('userId', 'name avatar')
            .lean()
        if (!product) return response(false, 404, 'Product not found')

        const category = await ShopCategoryModel.findOne({
            _id: product.category,
            slug: categorySlug,
            deletedAt: null,
        }).lean()
        if (!category) return response(false, 404, 'Product not found')

        const [subcategory, reviewStats, variants] = await Promise.all([
            ShopSubcategoryModel.findOne({ _id: product.subcategory, shopCategory: category._id, deletedAt: null })
                .select('shopSubCategory slug')
                .lean(),
            ReviewModel.aggregate([
                { $match: { product: product._id, deletedAt: null } },
                { $group: { _id: null, count: { $sum: 1 }, averageRating: { $avg: '$rating' } } },
            ]),
            ProductVariantModel.find({ product: product._id, status: 'approved', deletedAt: null })
                .populate('media', '_id secure_url thumbnail_url alt')
                .sort({ createdAt: 1 })
                .lean(),
        ])

        return response(true, 200, 'Shop product fetched', {
            product,
            category,
            subcategory,
            variants,
            reviewStats: reviewStats[0] || { count: 0, averageRating: 0 },
        })
    } catch (error) {
        return catchError(error)
    }
}