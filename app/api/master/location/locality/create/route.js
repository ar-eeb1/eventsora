import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, escapeRegExp } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import LocalityModel from "@/models/Locality.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            city: true, locality: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { city } = validate.data
        const localityValue = validate.data.locality.trim()

        const existingLocality = await LocalityModel.findOne({
            city,
            locality: new RegExp(`^${escapeRegExp(localityValue)}$`, 'i')
        })

        if (existingLocality) {
            return response(false, 409, 'Locality already exists for the selected city.')
        }

        const newLocality = new LocalityModel({
            city,
            locality: localityValue
        })
        await newLocality.save()

        return response(true, 200, 'Locality added.')
    } catch (error) {
        return catchError(error)
    }
}