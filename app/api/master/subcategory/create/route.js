import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";
import SubcategoryModel from "@/models/subcategory.model";

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
        const newSubcategory = new SubcategoryModel({
            category, subcategory, slug
        })
        await newSubcategory.save()


        return response(true, 200, 'Sub Category added.')
    } catch (error) {
        return catchError(error)
    }
}