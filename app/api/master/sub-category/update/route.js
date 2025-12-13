import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";
import SubCategoryModel from "@/models/SubCategory.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, subCategory: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, subCategory, slug } = validate.data

        const getSubCateogory = await SubCategoryModel.findOne({ deletedAt: null, _id })
        if (!getSubCateogory) {
            return response(false, 404, 'Data not found')
        }

        getSubCateogory.subCategory = subCategory 
        getSubCateogory.slug = slug

        return response(true, 200, 'Sub Category updated.')
    } catch (error) {
        return catchError(error)
    }
}