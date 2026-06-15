import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, category: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, category, slug } = validate.data
        const getCategory = await CategoryModel.findOne({ deletedAt: null, _id })
        if (!getCategory) {
            return response(false, 404, 'Category not found')
        }

        getCategory.category = category
        getCategory.slug = slug
        await getCategory.save()


        return response(true, 200, 'Category updated.')
    } catch (error) {
        return catchError(error)
    }
}