import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import StateModel from "@/models/State.model";
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
        const getState = await StateModel.findOne(filter).lean()
        if (!getState) {
            return response(false, 404, 'State not found')
        }

        return response(true, 200, 'State Found', getState)
    } catch (error) {
        return catchError(error)
    }
}