import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ListingModel from "@/models/Listing.model";
import SubcategoryModel from "@/models/Subcategory.model";
import CalendarModel from "@/models/Calendar.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB();
        const searchParams = request.nextUrl.searchParams

        // GET FILTER FROM QUERY PARAMS
        const categorySlug = searchParams.get('category')
        const subcategorySlug = searchParams.get('subcategory')
        const minPrice = parseInt(searchParams.get('minPrice')) || 0
        const maxPrice = parseInt(searchParams.get('maxPrice')) || 1000000
        const minCapacity = parseInt(searchParams.get('minCapacity')) || 0
        const maxCapacity = parseInt(searchParams.get('maxCapacity')) || 3000
        const search = searchParams.get('q')
        const filterStartDate = searchParams.get('startDate')
        const filterEndDate = searchParams.get('endDate')


        // PAGINATION
        const limit = parseInt(searchParams.get('limit')) || 9
        const page = parseInt(searchParams.get('page')) || 0
        const skip = page * limit

        // SORTING
        const sortOption = searchParams.get('sort') || 'default_sorting'
        let sortQuery = {}
        if (sortOption === 'default_sorting') sortQuery = { createdAt: -1 }
        if (sortOption === 'asc') sortQuery = { name: 1 }
        if (sortOption === 'desc') sortQuery = { name: -1 }
        if (sortOption === 'price_low_high') sortQuery = { startingPrice: 1 }
        if (sortOption === 'price_high_low') sortQuery = { startingPrice: -1 }

        


        let categoryId = []
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select("_id").lean()
            categoryId = categoryData.map(category => category._id)
        }

        let subcategoryId = []
        if (subcategorySlug) {
            const slugs = subcategorySlug.split(',')
            const subcategoryData = await SubcategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select("_id").lean()
            subcategoryId = subcategoryData.map(subcategory => subcategory._id)
        }

        // MATCH STAGE
        let matchStage = {
            status: 'approved'
        }

        // Apply Price and Capacity Filters to Match Stage directly so pagination doesn't break
        matchStage.$and = [
            { startingPrice: { $gte: minPrice, $lte: maxPrice } },
            {
                $or: [
                    { capacity: null },
                    { capacity: { $gte: minCapacity, $lte: maxCapacity } }
                ]
            }
        ];

        if (categoryId.length > 0) matchStage.category = { $in: categoryId } // filter by category
        if (subcategoryId.length > 0) matchStage.subcategory = { $in: subcategoryId } // filter by subcategory


        if (search) {
            matchStage.name = { $regex: search, $options: 'i' }
        }

        const city = searchParams.get('city')
        if (city) {
            const cityIds = city.split(',').map(id => new mongoose.Types.ObjectId(id))
            matchStage.city = { $in: cityIds }
        }

        const locality = searchParams.get('locality')
        if (locality) {
            const localityIds = locality.split(',').map(id => new mongoose.Types.ObjectId(id))
            matchStage.locality = { $in: localityIds }
        }

        if (filterStartDate || filterEndDate) {
            let startQueryDate = new Date();
            let endQueryDate = new Date();

            if (filterStartDate) {
                startQueryDate = new Date(filterStartDate);
                startQueryDate.setUTCHours(0, 0, 0, 0);
            } else if (filterEndDate) {
                startQueryDate = new Date(filterEndDate);
                startQueryDate.setUTCHours(0, 0, 0, 0);
            }

            if (filterEndDate) {
                endQueryDate = new Date(filterEndDate);
                endQueryDate.setUTCHours(23, 59, 59, 999);
            } else if (filterStartDate) {
                endQueryDate = new Date(filterStartDate);
                endQueryDate.setUTCHours(23, 59, 59, 999);
            }

            // Find entries for this date range that are either explicitly booked or blocked
            const unavailableListings = await CalendarModel.find({
                date: { $gte: startQueryDate, $lte: endQueryDate },
                dateStatus: { $in: ['booked', 'blocked'] },
                deletedAt: null
            }).select('listingId variantId').lean();

            if (unavailableListings.length > 0) {
                const blockedListingIds = unavailableListings
                    .filter(item => !item.variantId) // Entire listing is blocked/booked
                    .map(item => item.listingId);

                if (blockedListingIds.length > 0) {
                    matchStage._id = { $nin: blockedListingIds };
                }
            }
        }


        let blockedVariantIds = [];
        if (filterStartDate || filterEndDate) {
            let startQueryDate = new Date();
            let endQueryDate = new Date();
            if (filterStartDate) { startQueryDate = new Date(filterStartDate); startQueryDate.setUTCHours(0, 0, 0, 0); } else if (filterEndDate) { startQueryDate = new Date(filterEndDate); startQueryDate.setUTCHours(0, 0, 0, 0); }
            if (filterEndDate) { endQueryDate = new Date(filterEndDate); endQueryDate.setUTCHours(23, 59, 59, 999); } else if (filterStartDate) { endQueryDate = new Date(filterStartDate); endQueryDate.setUTCHours(23, 59, 59, 999); }

            const unavailableVariants = await CalendarModel.find({
                date: { $gte: startQueryDate, $lte: endQueryDate },
                dateStatus: { $in: ['booked', 'blocked'] },
                variantId: { $ne: null },
                deletedAt: null
            }).select('variantId').lean();

            if (unavailableVariants.length > 0) {
                blockedVariantIds = unavailableVariants.map(item => item.variantId);
            }
        }

        // AGGREAGATION PIPELINE
        const listings = await ListingModel.aggregate([
            { $match: matchStage },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit + 1 },

            // Lookup variants (just for display, not for filtering)
            {
                $lookup: {
                    from: 'listingvariants',
                    localField: '_id',
                    foreignField: 'listingId',
                    as: 'variants'
                }
            },

            // Filter variants for display (optional)
            {
                $addFields: {
                    variants: {
                        $filter: {
                            input: "$variants",
                            as: 'variant',
                            cond: {
                                $and: [
                                    { $not: { $in: ["$$variant._id", blockedVariantIds] } },
                                    { $gte: ["$$variant.startingPrice", minPrice] },
                                    { $lte: ["$$variant.startingPrice", maxPrice] },
                                    {
                                        $or: [
                                            { $eq: ["$$variant.capacity", null] },
                                            {
                                                $and: [
                                                    { $gte: ["$$variant.capacity", minCapacity] },
                                                    { $lte: ["$$variant.capacity", maxCapacity] }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },

            // Media lookup
            {
                $lookup: {
                    from: 'medias',
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media'
                }
            },

            // City Lookup
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'city'
                }
            },
            { $unwind: '$city' },

            // Locality Lookup
            {
                $lookup: {
                    from: 'localities',
                    localField: 'locality',
                    foreignField: '_id',
                    as: 'locality'
                }
            },
            { $unwind: { path: '$locality', preserveNullAndEmptyArrays: true } },

            // Projection
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    startingPrice: 1,
                    capacity: 1,
                    media: {
                        _id: 1,
                        secure_url: 1,
                        alt: 1
                    },
                    variants: {
                        startingPrice: 1,
                        capacity: 1
                    },
                    city: { city: 1 },
                    locality: { locality: 1 },
                    tags: 1
                }
            }
        ])
        let nextPage = null
        if (listings.length > limit) {
            nextPage = page + 1
            listings.pop() // remove extra items
        }

        return response(true, 200, 'Listing Data Found', { listings, nextPage })
    } catch (error) {
        return catchError(error);
    }
}