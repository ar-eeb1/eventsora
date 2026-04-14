import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, escapeRegExp } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CityModel from "@/models/City.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            state: true, city: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { state } = validate.data
        const cityValue = validate.data.city.trim()

        const existingCity = await CityModel.findOne({
            state,
            city: new RegExp(`^${escapeRegExp(cityValue)}$`, 'i')
        })

        if (existingCity) {
            return response(false, 409, 'City already exists for the selected state.')
        }

        const newCity = new CityModel({
            state,
            city: cityValue
        })
        await newCity.save()

        return response(true, 200, 'City added.')
    } catch (error) {
        return catchError(error)
    }
}