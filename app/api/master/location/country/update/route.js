import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CountryModel from "@/models/Country.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            _id: true, country: true, code: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const { _id, country, code } = validate.data
        const getCountry = await CountryModel.findOne({ deletedAt: null, _id })
        if (!getCountry) {
            return response(false, 404, 'Country not found')
        }

        getCountry.country = country
        getCountry.code = code
        await getCountry.save()


        return response(true, 200, 'Country updated.')
    } catch (error) {
        return catchError(error)
    }
}