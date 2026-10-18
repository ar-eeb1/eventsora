import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ShopCategoryModel from "@/models/ShopCategory.model";

// GET single shop category by id
export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const { id } = await params

        const shopCategory = await ShopCategoryModel.findById(id).lean()
        if (!shopCategory) {
            return response(false, 404, 'Shop Category not found.')
        }

        return response(true, 200, 'Success', shopCategory)
    } catch (error) {
        return catchError(error)
    }
}

// UPDATE shop category by id
export async function PUT(request, { params }) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const { id } = await params
        const payload = await request.json()

        const schema = zSchema.pick({
            category: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { category, slug } = validate.data

        const shopCategory = await ShopCategoryModel.findById(id)
        if (!shopCategory) {
            return response(false, 404, 'Shop Category not found.')
        }

        // Check duplicate (excluding current document)
        const duplicate = await ShopCategoryModel.findOne({
            _id: { $ne: id },
            $or: [{ category }, { slug }]
        })
        if (duplicate) {
            return response(false, 409, 'Shop Category already exists.')
        }

        shopCategory.category = category
        shopCategory.slug = slug
        await shopCategory.save()

        return response(true, 200, 'Shop Category updated.')
    } catch (error) {
        return catchError(error)
    }
}
