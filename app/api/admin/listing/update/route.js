import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import ListingModel from "@/models/Listing.model";
import { encode } from "entities";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
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
                status: true,
                adminNote: true,
                tags: true,
                listingType: true,
            })
            .partial({
                locality: true,
                sublocality: true,
                capacity: true,
            });

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing fields.', validate.error)
        }

        const validatedData = validate.data



        const getListing = await ListingModel.findOne({ deletedAt: null, _id: validatedData._id })
        if (!getListing) {
            return response(false, 404, 'Listing not found')
        }

        getListing.name = validatedData.name
        getListing.slug = validatedData.slug
        getListing.category = validatedData.category
        getListing.subcategory = validatedData.subcategory
        getListing.startingPrice = validatedData.startingPrice
        getListing.media = validatedData.media
        getListing.description = encode(validatedData.description)
        getListing.country = validatedData.country
        getListing.state = validatedData.state
        getListing.city = validatedData.city
        getListing.locality = validatedData.locality
        getListing.sublocality = validatedData.sublocality
        getListing.address = validatedData.address
        getListing.capacity = validatedData.capacity
        getListing.status = validatedData.status
        getListing.adminNote = validatedData.adminNote || null
        getListing.tags = validatedData.tags || []
        getListing.listingType = validatedData.listingType || null

        if (validatedData.status !== getListing.status) {
            getListing.reviewedAt = new Date()
            getListing.reviewedBy = auth.user._id // admin id

            if (validatedData.status === 'approved') {
                getListing.approvedAt = new Date()
                getListing.approvedBy = auth.user._id
            }
        }
        if (
            validatedData.status === 'rejected' &&
            !validatedData.adminNote
        ) {
            return response(false, 400, 'Admin note is required when rejecting a listing.')
        }


        await getListing.save()


        return response(true, 200, 'Listing updated.')
    } catch (error) {
        return catchError(error)
    }
}