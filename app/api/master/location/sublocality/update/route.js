import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import SublocalityModel from "@/models/Sublocality.model";


export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, sublocality: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, sublocality } = validate.data

        const getSublocality = await SublocalityModel.findOne({ deletedAt: null, _id })
        if (!getSublocality) {
            return response(false, 404, 'Data not found')
        }

        getSublocality.sublocality = sublocality
        await getSublocality.save()

        return response(true, 200, 'Sublocality updated.')
    } catch (error) {
        return catchError(error)
    }
}