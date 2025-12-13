import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import StateModel from "@/models/State.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, state: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, state } = validate.data

        const getState = await StateModel.findOne({ deletedAt: null, _id })
        if (!getState) {
            return response(false, 404, 'Data not found')
        }

        getState.state = state 
        await getState.save()

        return response(true, 200, 'State updated.')
    } catch (error) {
        return catchError(error)
    }
}