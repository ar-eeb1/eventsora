import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ShopSubcategoryModel from "@/models/ShopSubcategory.model";
import ShopCategoryModel from "@/models/ShopCategory.model";
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
        const getShopSubCateogory = await ShopSubcategoryModel.findOne(filter).lean()
        if (!getShopSubCateogory) {
            return response(false, 404, 'Shop Sub Category not found')
        }

        return response(true, 200, 'Shop Sub Category Found', getShopSubCateogory)
    } catch (error) {
        return catchError(error)
    }
}