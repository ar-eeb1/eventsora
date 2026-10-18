import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ShopCategoryModel from "@/models/ShopCategory.model";
import ShopSubcategoryModel from "@/models/ShopSubcategory.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            category: true, subcategory: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { category, subcategory, slug } = validate.data
        const existingSubategory = await ShopSubcategoryModel.findOne({
            shopSubCategory: subcategory, slug
        })
        if (existingSubategory) {
            return response(false, 409, 'Subcategory Already exists')
        }
        const newShopSubcategory = new ShopSubcategoryModel({
            shopCategory: category,
            shopSubCategory: subcategory,
            slug
        })
        await newShopSubcategory.save()


        return response(true, 200, 'Shop sub category added.')
    } catch (error) {
        return catchError(error)
    }
}