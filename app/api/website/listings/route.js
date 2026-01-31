import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ListingModel from "@/models/Listing.model";
import SubcategoryModel from "@/models/Subcategory.model";
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
        let matchStage = {}
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


        // AGGREAGATION PIPELINE
        // AGGREGATION PIPELINE
        const listings = await ListingModel.aggregate([
            { $match: matchStage },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit + 1 },

            // Filter listings by their own price and capacity
            {
                $match: {
                    $and: [
                        { startingPrice: { $gte: minPrice, $lte: maxPrice } },
                        {
                            $or: [
                                { capacity: null },
                                { capacity: { $gte: minCapacity, $lte: maxCapacity } }
                            ]
                        }
                    ]
                }
            },

            // Lookup variants (just for display, not for filtering)
            {
                $lookup: {
                    from: 'listingvariants',
                    localField: '_id',
                    foreignField: 'listing',
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
            { $unwind: '$locality' },

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
                    locality: { locality: 1 }
                }
            }
        ])
        // const listings = await ListingModel.aggregate([
        //     { $match: matchStage },
        //     { $sort: sortQuery },
        //     { $skip: skip },
        //     { $limit: limit + 1 },

        //     // Filter listings by their own price and capacity
        //     {
        //         $match: {
        //             $and: [
        //                 { startingPrice: { $gte: minPrice, $lte: maxPrice } },
        //                 {
        //                     $or: [
        //                         { capacity: null },
        //                         { capacity: { $gte: minCapacity, $lte: maxCapacity } }
        //                     ]
        //                 }
        //             ]
        //         }
        //     },

        //     // Lookup variants (just for display, not for filtering)
        //     {
        //         $lookup: {
        //             from: 'listingvariants',
        //             localField: '_id',
        //             foreignField: 'listing',
        //             as: 'variants'
        //         }
        //     },

        //     // Filter variants for display (optional)
        //     {
        //         $addFields: {
        //             variants: {
        //                 $filter: {
        //                     input: "$variants",
        //                     as: 'variant',
        //                     cond: {
        //                         $and: [
        //                             { $gte: ["$$variant.startingPrice", minPrice] },
        //                             { $lte: ["$$variant.startingPrice", maxPrice] },
        //                             {
        //                                 $or: [
        //                                     { $eq: ["$$variant.capacity", null] },
        //                                     {
        //                                         $and: [
        //                                             { $gte: ["$$variant.capacity", minCapacity] },
        //                                             { $lte: ["$$variant.capacity", maxCapacity] }
        //                                         ]
        //                                     }
        //                                 ]
        //                             }
        //                         ]
        //                     }
        //                 }
        //             }
        //         }
        //     },

        //     // Media lookup
        //     {
        //         $lookup: {
        //             from: 'medias',
        //             localField: 'media',
        //             foreignField: '_id',
        //             as: 'media'
        //         }
        //     },

        //     // Projection
        //     {
        //         $project: {
        //             _id: 1,
        //             name: 1,
        //             slug: 1,
        //             startingPrice: 1,
        //             capacity: 1,
        //             media: {
        //                 _id: 1,
        //                 secure_url: 1,
        //                 alt: 1
        //             },
        //             variants: {
        //                 startingPrice: 1,
        //                 capacity: 1
        //             }
        //         }
        //     }
        // ])

        // CHECK FOR MORE DATA
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