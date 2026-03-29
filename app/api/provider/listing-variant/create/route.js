import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ListingVariantModel from "@/models/ListingVariant.model";
import ListingModel from "@/models/Listing.model";

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
                listingId: true,
                title: true,
                // media: true,
                serviceCode: true,
                startingPrice: true,
                pricingType: true,
                points: true,
                minPersons: true,
            })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const listingVariantData = validate.data

        // Check if listing belongs to provider
        const listing = await ListingModel.findOne({ _id: listingVariantData.listingId, userId: auth.userId });
        if (!listing) {
            return response(false, 403, 'Parent listing not found or access denied.');
        }
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