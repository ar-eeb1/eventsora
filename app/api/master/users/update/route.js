import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true,
            role: true,
            expire: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, role, expire } = validate.data

        const getUser = await UserModel.findOne({ deletedAt: null, _id })
        if (!getUser) {
            return response(false, 404, 'Data not found')
        }

        getUser.role = role

        if (expire && expire !== 'null') {
            const days = parseInt(expire)
            const expireAt = new Date()
            expireAt.setDate(expireAt.getDate() + days)
            getUser.expireAt = expireAt
        } else if (expire === 'null') {
            getUser.expireAt = null
        }

        await getUser.save()

        return response(true, 200, 'User updated.')
    } catch (error) {
        return catchError(error)
    }
}