import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ShopCategoryModel from "@/models/ShopCategory.model";
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
        const getCategory = await ShopCategoryModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getCategory) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getCategory)
    } catch (error) {
        return catchError(error)
    }
}