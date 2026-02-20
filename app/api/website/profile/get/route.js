import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/user.Model";

export async function GET() {
    try {
        await connectDB()

        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 401, 'unauthorized')
        }

        const userId = auth.userId
        const user = await UserModel.findById(userId).lean()

        if (!user) {
            return response(false, 404, 'user not found')
        }
        return response(true, 200, 'User data', user)
    } catch (error) {       
        return catchError(error)
    }

}