import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopCategory',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopSubCategory',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    stockType: {
        type: String,
        enum: ["in_stock", "made_to_order"],
        default: "in_stock"
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    processingTime: {
        value: {
            type: Number,
            default: 0,
            min: 0
        },

        unit: {
            type: String,
            enum: ["hours", "days"],
            default: "days"
        }
    },
    customizable: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
        }
    ],
    description: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "draft"],
        default: "pending"
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ✅ admins are users
    },
    approvedAt: {
        type: Date,
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredAt: {
        type: Date,
        default: null
    },
    featuredUntil: {
        type: Date,
        default: null
    },
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ],
    inquirePrice: {
        type: Boolean,
        default: false
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    reviewCount: {
        type: Number,
        default: 0,
        min: 0,
    },

    soldCount: {
        type: Number,
        default: 0,
        min: 0,
    },

}, { timestamps: true })
productSchema.index({ category: 1 })

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, 'products')
export default ProductModel
