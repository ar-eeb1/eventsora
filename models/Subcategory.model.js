import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
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

const SubcategoryModel = mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema, 'subcategories')
export default SubcategoryModel