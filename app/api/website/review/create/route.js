import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import reviewModel from "@/models/Review.model";
import ProductModel from "@/models/Product.Model";
import mongoose from "mongoose";
import z from "zod";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['provider', 'user'])
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            title: true,
            review: true,
        }).extend({
            rating: z.coerce.number().min(1).max(5),
            listing: z.string().min(1).optional(),
            product: z.string().min(1).optional(),
        }).superRefine((data, ctx) => {
            if ([data.listing, data.product].filter(Boolean).length !== 1) {
                ctx.addIssue({ code: 'custom', message: 'Provide exactly one review target.' })
            }
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        const { listing, product, rating, title, review } = validate.data
        const targetId = listing || product
        if (!mongoose.isValidObjectId(targetId)) return response(false, 400, 'Invalid review target.')

        if (listing) {
            const ListingModel = (await import('@/models/Listing.model')).default
            if (!await ListingModel.exists({ _id: listing, deletedAt: null, status: 'approved' })) return response(false, 404, 'Listing not found.')
        } else if (product) {
            if (!await ProductModel.exists({ _id: product, deletedAt: null, status: 'approved' })) return response(false, 404, 'Product not found.')
        }


        // const existingReview = await reviewModel.findOne({ listing, user: userId })
        // if (existingReview) {
        //     return response(false, 409, 'You have already reviewed this listing')
        // }

        const newReview = new reviewModel({
            listing,
            product,
            user: auth.userId,
            rating: rating,
            title: title,
            review: review
        })

        await newReview.save()

        return response(true, 200, 'Review submitted successfully')

    } catch (error) {
        return catchError(error)
    }
}