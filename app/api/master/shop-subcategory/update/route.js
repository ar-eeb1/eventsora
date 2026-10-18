import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ShopSubcategoryModel from "@/models/ShopSubcategory.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, category: true, subcategory: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, category, subcategory, slug } = validate.data

        const existingShopSubCategory = await ShopSubcategoryModel.findOne({
            deletedAt: null,
            _id: { $ne: _id },
            $or: [{ shopSubCategory: subcategory }, { slug }]
        })

        if (existingShopSubCategory) {
            return response(false, 409, 'Shop Sub Category already exists.')
        }

        const getShopSubCategory = await ShopSubcategoryModel.findOne({ deletedAt: null, _id })
        if (!getShopSubCategory) {
            return response(false, 404, 'Data not found')
        }

        getShopSubCategory.shopCategory = category
        getShopSubCategory.shopSubCategory = subcategory
        getShopSubCategory.slug = slug
        await getShopSubCategory.save()

        return response(true, 200, 'Shop Sub Category updated.')
    } catch (error) {
        return catchError(error)
    }
}