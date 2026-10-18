import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
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
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
        }
    ],
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
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

}, { timestamps: true })

productVariantSchema.index({ product: 1, name: 1 })
productVariantSchema.index({ product: 1, deletedAt: 1 })

const ProductVariantModel = mongoose.models.ProductVariant || mongoose.model('ProductVariant', productVariantSchema, 'productVariants')
export default ProductVariantModel
