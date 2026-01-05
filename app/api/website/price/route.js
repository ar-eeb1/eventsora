const { connectDB } = require("@/lib/databaseConnection");
const { catchError } = require("@/lib/helperFunction");
const { default: ListingVariantModel } = require("@/models/ListingVariant.model");

try {
    await connectDB()
    const getPrice = await ListingVariantModel.distinct('price').lean()
} catch (error) {
    return catchError(error)
}