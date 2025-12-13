import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CityModel from "@/models/City.model";
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
            _id: true, city: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, city } = validate.data

        const getCity = await CityModel.findOne({ deletedAt: null, _id })
        if (!getCity) {
            return response(false, 404, 'Data not found')
        }

        getCity.city = city
        await getCity.save()

        return response(true, 200, 'City updated.')
    } catch (error) {
        return catchError(error)
    }
}