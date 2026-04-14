import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ListingModel from "@/models/Listing.model";
import SubcategoryModel from "@/models/subcategory.model";
import UserModel from "@/models/user.Model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('master');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();

        const [listing, categories, subcategories, users, provider] = await Promise.all([
            ListingModel.countDocuments({ deletedAt: null }),
            CategoryModel.countDocuments({ deletedAt: null }),
            SubcategoryModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null, role: 'provider' }),
        ])

        return response(true, 200, 'Dashboard Count', { listing, categories, subcategories, users, provider })
    } catch (error) {
        return catchError(error);
    }
}