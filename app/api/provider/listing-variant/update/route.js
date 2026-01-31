import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()
        const schema = zSchema
            .pick({
                _id: true,
                listingId: true,
                title: true,
                serviceCode: true,
                startingPrice: true,
                pricingType: true,
                points: true,
            })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const validatedData = validate.data

        const getListingVariant = await ListingVariantModel.findOne({ deletedAt: null, _id: validatedData._id })
        if (!getListingVariant) {
            return response(false, 404, 'Listing Variant not found')
        }

        getListingVariant.listingId = validatedData.listingId
        getListingVariant.title = validatedData.title
        getListingVariant.serviceCode = validatedData.serviceCode
        getListingVariant.startingPrice = validatedData.startingPrice
        getListingVariant.pricingType = validatedData.pricingType
        getListingVariant.points = validatedData.points

        await getListingVariant.save()


        return response(true, 200, 'Listing Variant updated.')
    } catch (error) {
        return catchError(error)
    }
}