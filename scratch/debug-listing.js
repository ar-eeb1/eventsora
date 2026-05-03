const mongoose = require('mongoose');
const ListingModel = require('./models/Listing.model').default;
const CategoryModel = require('./models/Category.model').default;
const { connectDB } = require('./lib/databaseConnection');

async function debug() {
    await connectDB();
    const listingId = '69f748b8aa1c4de73c297120';
    const listing = await ListingModel.findById(listingId).populate('category');
    
    if (!listing) {
        console.log("Listing not found!");
        process.exit();
    }

    console.log("Listing Name:", listing.name);
    console.log("Status:", listing.status);
    console.log("Category Name:", listing.category.category);
    console.log("Category Slug:", listing.category.slug);
    console.log("DeletedAt:", listing.deletedAt);

    const venuesCategory = await CategoryModel.findOne({ slug: 'venues' });
    console.log("Venues Category ID:", venuesCategory?._id);
    console.log("Matches Venues Category?", listing.category._id.toString() === venuesCategory?._id.toString());

    process.exit();
}

debug();
