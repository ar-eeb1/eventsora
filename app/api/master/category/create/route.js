import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            category: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { category, slug } = validate.data
        const existingCategory = await CategoryModel.findOne({
            category,
            slug
        })

        if (existingCategory) {
            return response(false, 409, 'Category already Exists')
        }
        const newCategory = new CategoryModel({
            category, slug
        })
        await newCategory.save()


        return response(true, 200, 'Category added.')
    } catch (error) {
        return catchError(error)
    }
}