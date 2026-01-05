import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema
            .pick({
                listing: true,
                title: true,
                media: true,
                serviceCode: true,
                startingPrice: true,
                pricingType: true,
            })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const listingVariantData = validate.data
        const newListing = new ListingVariantModel({
            ...listingVariantData,
            userId: auth.userId
        })

        await newListing.save()


        return response(true, 200, 'Listing Variant created.')
    } catch (error) {
        return catchError(error)
    }
}