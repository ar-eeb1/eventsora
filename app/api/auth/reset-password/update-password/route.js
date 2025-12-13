import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.Model";

export async function PUT(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true, password: true
        })
        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { email, password } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")

        getUser.password = password

        if (!getUser) {
            return response(false, 404, 'User not found')
        }
        await getUser.save()

        return response(true, 200, 'Password Updated')
    } catch (error) {
        catchError(error)
    }
}