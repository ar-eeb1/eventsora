import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import LocalityModel from "@/models/Locality.model";
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
        const getLocality = await LocalityModel.findOne(filter).lean()
        if (!getLocality) {
            return response(false, 404, 'Locality not found')
        }

        return response(true, 200, 'City Found', getLocality)
    } catch (error) {
        return catchError(error)
    }
}