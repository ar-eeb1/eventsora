import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/user.Model";

export async function POST(request) {
    try {
        await connectDB()

        const auth = await isAuthenticated(['user', 'provider'])

        if (!auth.isAuth) {
            return response(false, 401, 'unauthorized')
        }

        const userId = auth.userId
        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return response(false, 400, 'Current and new password are required')
        }

        const user = await UserModel.findById(userId).select('+password')
        if (!user) {
            return response(false, 404, 'user not found')
        }

        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            return response(false, 400, 'Invalid current password')
        }

        user.password = newPassword
        await user.save()

        return response(true, 200, 'Password updated successfully')
    } catch (error) {
        return catchError(error)
    }
}
