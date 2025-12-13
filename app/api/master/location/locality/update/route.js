import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import LocalityModel from "@/models/Locality.model";


export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, locality: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, locality } = validate.data

        const getLocality = await LocalityModel.findOne({ deletedAt: null, _id })
        if (!getLocality) {
            return response(false, 404, 'Data not found')
        }

        getLocality.locality = locality
        await getLocality.save()

        return response(true, 200, 'locality updated.')
    } catch (error) {
        return catchError(error)
    }
}