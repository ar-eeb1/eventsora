import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, escapeRegExp } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import StateModel from "@/models/State.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            country: true, state: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { country } = validate.data
        const stateValue = validate.data.state.trim()

        const existingState = await StateModel.findOne({
            country,
            state: new RegExp(`^${escapeRegExp(stateValue)}$`, 'i')
        })

        if (existingState) {
            return response(false, 409, 'State already exists for the selected country.')
        }

        const newState = new StateModel({
            country,
            state: stateValue
        })
        await newState.save()

        return response(true, 200, 'State added.')
    } catch (error) {
        return catchError(error)
    }
}