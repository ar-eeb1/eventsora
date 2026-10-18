import mongoose from "mongoose";

const shopSubcategorySchema = new mongoose.Schema({
    shopCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopCategory",
        required: true
    },
    shopSubCategory: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

const ShopSubcategoryModel = mongoose.models.ShopSubcategory || mongoose.model('ShopSubcategory', shopSubcategorySchema, 'shopsubcategories')
export default ShopSubcategoryModel