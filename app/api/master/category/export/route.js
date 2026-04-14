import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import SubcategoryModel from "@/models/subcategory.model";
import { isValidObjectId } from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const filter = {
            deletedAt: null
        }
        const getSubcategory = await SubcategoryModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getSubcategory) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getSubcategory)
    } catch (error) {
        return catchError(error)
    }
}