import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
    try {
        await connectDB()
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return response(false, 401, 'Unauthorized')
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const { payload } = await jwtVerify(token, secret)

        const user = await UserModel.findById(payload.userId).lean()
        if (!user) {
            return response(false, 401, 'User not found')
        }

        const userData = {
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }

        return response(true, 200, 'User profile fetched', userData)

    } catch (error) {
        console.error("Auth Me Error:", error)
        return response(false, 401, 'Unauthorized')
    }
}
