import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();

        const [listing] = await Promise.all([
            ListingModel.countDocuments({ deletedAt: null, userId: auth.userId })
        ])

        return response(true, 200, 'Dashboard Count', { listing })
    } catch (error) {
        return catchError(error);
    }
}