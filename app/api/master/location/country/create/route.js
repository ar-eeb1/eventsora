import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, escapeRegExp } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CountryModel from "@/models/Country.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            country: true, code: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const countryValue = validate.data.country.trim()
        const codeValue = validate.data.code.trim().toUpperCase()

        const existingCountry = await CountryModel.findOne({
            $or: [
                { country: new RegExp(`^${escapeRegExp(countryValue)}$`, 'i') },
                { code: codeValue }
            ]
        })

        if (existingCountry) {
            return response(false, 409, 'Country name or code already exists.')
        }

        const newCountry = new CountryModel({
            country: countryValue,
            code: codeValue
        })
        await newCountry.save()

        return response(true, 200, 'Country added.')
    } catch (error) {
        return catchError(error)
    }
}