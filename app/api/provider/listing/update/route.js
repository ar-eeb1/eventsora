import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import ListingModel from "@/models/Listing.model";
import { encode } from "entities";

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

        const validatedData = validate.data

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const getListing = await ListingModel.findOne({ deletedAt: null, _id: validatedData._id, userId: userObjectId })
        if (!getListing) {
            return response(false, 404, 'Listing not found or access denied')
        }

        getListing.name = validatedData.name
        getListing.slug = validatedData.slug
        getListing.category = validatedData.category
        getListing.subcategory = validatedData.subcategory
        getListing.startingPrice = validatedData.startingPrice
        getListing.media = validatedData.media
        getListing.description = validatedData.description
        getListing.country = validatedData.country
        getListing.state = validatedData.state
        getListing.city = validatedData.city
        getListing.locality = validatedData.locality || null
        getListing.sublocality = validatedData.sublocality || null
        getListing.address = validatedData.address
        getListing.capacity = validatedData.capacity
        getListing.inquirePrice = validatedData.inquirePrice ?? false
        getListing.listingType = validatedData.listingType || null

        await getListing.save()


        return response(true, 200, 'Listing updated.')
    } catch (error) {
        return catchError(error)
    }
}