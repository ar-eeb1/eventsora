import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import UserModel from "@/models/user.Model";

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
        const getUser = await UserModel.findOne(filter).lean()
        if (!getUser) {
            return response(false, 404, 'User not found')
        }

        return response(true, 200, 'Use Found', getUser)
    } catch (error) {
        return catchError(error)
    }
}