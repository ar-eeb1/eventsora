import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
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
                name: true,
                slug: true,
                category: true,
                subcategory: true,
                startingPrice: true,
                media: true,
                description: true,
                country: true,
                state: true,
                city: true,
                locality: true,
                sublocality: true,
                address: true,
                capacity: true,
                inquirePrice: true,
                listingType: true,
            })
            .partial({
                locality: true,
                sublocality: true,
                capacity: true,
                inquirePrice: true,
            });
            
        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const listingData = validate.data
        if (!listingData.locality) delete listingData.locality;
        if (!listingData.sublocality) delete listingData.sublocality;

        const newListing = new ListingModel({
            ...listingData,
            startingPrice: Number(listingData.startingPrice),
            userId: auth.userId
        })

        await newListing.save()


        return response(true, 200, 'Listing added.')
    } catch (error) {
        return catchError(error)
    }
}