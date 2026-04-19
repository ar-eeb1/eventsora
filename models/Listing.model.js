import { listingStatus, tags } from "@/lib/utils";
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
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
    locality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locality',
    },
    sublocality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sublocality',
    },
    address: {
        type: String,
        required: true
    },
    capacity: {
        type: Number
    },
    status: {
        type: String,
        enum: listingStatus,
        default: 'pending'
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
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ✅ admins are users
    },
    reviewedAt: {
        type: Date,
    },
    adminNote: {
        type: String,
        default: null,
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
            enum: tags,
            trim: true,
            lowercase: true
        }
    ],
    inquirePrice: {
        type: Boolean,
        default: false
    },


}, { timestamps: true })

listingSchema.index({ category: 1, subcategory: 1 })
listingSchema.index({ city: 1 })
listingSchema.index({ state: 1 })
listingSchema.index({ userId: 1 })
listingSchema.index({ status: 1 })
const ListingModel = mongoose.models.Listing || mongoose.model('Listing', listingSchema, 'listings')
export default ListingModel