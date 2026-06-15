import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import CityModel from "@/models/City.model";
import CountryModel from "@/models/Country.model";
import ListingModel from "@/models/Listing.model";
import LocalityModel from "@/models/Locality.model";
import MediaModel from "@/models/Media.model";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');

    let filter = {
      deletedAt: null,
      status: 'approved',
    };

    // GET CATEGORY
    if (categorySlug) {
      const category = await CategoryModel.findOne({
        slug: categorySlug.toLowerCase(),
        deletedAt: null,
      }).select('_id');

      if (!category) {
        return response(false, 404, 'Category not found');
      }

      filter.category = category._id;
    }



    const listings = await ListingModel.find(filter) // ✅ USE FILTER
      .sort({ createdAt: -1 })
      .populate('media', '_id secure_url')
      .populate('category', '_id category slug')
      .populate('city', '_id city')
      .populate('locality', '_id locality')
      .limit(20)
      .lean();


    if (!listings.length) {
      return response(false, 404, 'Listing not found');
    }

    return response(true, 200, 'Listing Found', listings);
  } catch (error) {
    return catchError(error);
  }
}
