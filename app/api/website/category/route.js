import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";

export async function GET() {
    try {
        await connectDB();

        const getCategory = await CategoryModel.find({ deletedAt: null }).lean()

        if (!getCategory) {
            return response(false, 404, 'Subcategory not found')
        }

        return response(true, 200, 'Categories', getCategory)
    } catch (error) {
        return catchError(error);
    }
}