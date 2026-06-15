import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import SubcategoryModel from "@/models/Subcategory.model";
import ListingModel from "@/models/Listing.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // venues, photographers, etc.

    let query = { deletedAt: null };
    let listingQuery = { status: "approved", deletedAt: null };

    // If category slug is provided
    if (type) {
      const category = await CategoryModel.findOne({
        slug: type,
        deletedAt: null
      }).lean();

      if (!category) {
        return response(false, 404, "Category not found");
      }

      query.category = category._id;
      listingQuery.category = category._id;
    }

    // Get unique subcategory IDs from approved and active listings
    const activeSubcategoryIds = await ListingModel.distinct("subcategory", listingQuery);
    
    query._id = { $in: activeSubcategoryIds };

    const subcategories = await SubcategoryModel
      .find(query)
      .populate("category", "category slug")
      .lean();

    return response(true, 200, "Subcategories fetched", subcategories);

  } catch (error) {
    return catchError(error);
  }
}
