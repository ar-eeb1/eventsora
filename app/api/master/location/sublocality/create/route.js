import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import SublocalityModel from "@/models/Sublocality.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            locality: true, sublocality: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { locality, sublocality } = validate.data
        const newSublocality = new SublocalityModel({
            locality, sublocality
        })
        await newSublocality.save()

        return response(true, 200, 'Sublocality added.')
    } catch (error) {
        return catchError(error)
    }
}