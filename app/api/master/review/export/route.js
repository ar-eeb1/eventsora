import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

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
        const getUser = await UserModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getUser) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getUser)
    } catch (error) {
        return catchError(error)
    }
}