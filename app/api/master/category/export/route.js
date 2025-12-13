import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import SubCategoryModel from "@/models/SubCategory.model";
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
        const getSubCategory = await SubCategoryModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getSubCategory) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getSubCategory)
    } catch (error) {
        return catchError(error)
    }
}