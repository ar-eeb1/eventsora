import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'
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
            const priceRange = {}
            if (minPrice !== null) priceRange.$gte = minPrice
            if (maxPrice !== null) priceRange.$lte = maxPrice

            const candidateProductIds = await ProductModel.distinct('_id', filter)
            const variantProductIds = candidateProductIds.length
                ? await ProductVariantModel.distinct('product', {
                    product: { $in: candidateProductIds },
                    status: 'approved',
                    deletedAt: null,
                    price: priceRange,
                })
                : []
            filter.$or = [
                { price: priceRange },
                { _id: { $in: variantProductIds } },
            ]
        }

        const products = await ProductModel.find(filter)
            .populate('media', '_id secure_url thumbnail_url alt')
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(100)
            .lean()

        const variants = products.length
            ? await ProductVariantModel.find({
                product: { $in: products.map((product) => product._id) },
                status: 'approved',
                deletedAt: null,
            })
                .populate('media', '_id secure_url thumbnail_url alt')
                .sort({ createdAt: 1 })
                .lean()
            : []
        const variantsByProduct = new Map()
        for (const variant of variants) {
            const productId = variant.product.toString()
            const productVariants = variantsByProduct.get(productId) || []
            productVariants.push(variant)
            variantsByProduct.set(productId, productVariants)
        }

        const isWithinPriceRange = (price) => (
            (minPrice === null || price >= minPrice) &&
            (maxPrice === null || price <= maxPrice)
        )
        const filteredProducts = []
        for (const product of products) {
            const productVariants = variantsByProduct.get(product._id.toString()) || []
            if (productVariants.length) {
                const matchingVariants = productVariants.filter((variant) => isWithinPriceRange(variant.price))
                if (matchingVariants.length) {
                    filteredProducts.push({ ...product, variants: matchingVariants })
                }
            } else if (isWithinPriceRange(product.price)) {
                filteredProducts.push({ ...product, variants: [] })
            }
        }

        return response(true, 200, 'Shop products fetched', filteredProducts)
    } catch (error) {
        return catchError(error)
    }
}