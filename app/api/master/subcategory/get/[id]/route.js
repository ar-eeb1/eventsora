import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import SubcategoryModel from "@/models/Subcategory.model";
import CategoryModel from "@/models/Category.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 403, 'Invalid object id')
        }

        filter._id = id
        const getSubCateogory = await SubcategoryModel.findOne(filter).lean()
        if (!getSubCateogory) {
            return response(false, 404, 'Sub Category not found')
        }

        return response(true, 200, 'Sub Category Found', getSubCateogory)
    } catch (error) {
        return catchError(error)
    }
}