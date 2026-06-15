import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ListingModel from "@/models/Listing.model";

export async function GET() {
    try {
        await connectDB();

        // Get unique category IDs from approved and active listings
        const activeCategoryIds = await ListingModel.distinct("category", { status: "approved", deletedAt: null });

        const getCategory = await CategoryModel.find({ 
            _id: { $in: activeCategoryIds },
            deletedAt: null 
        }).lean()

        if (!getCategory) {
            return response(false, 404, 'Category not found')
        }

        return response(true, 200, 'Categories', getCategory)
    } catch (error) {
        return catchError(error);
    }
}