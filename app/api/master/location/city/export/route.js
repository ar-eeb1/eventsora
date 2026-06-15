import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CityModel from "@/models/City.model";

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
        const getCity = await CityModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getCity) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getCity)
    } catch (error) {
        return catchError(error)
    }
}