import { listingStatus, pricingType } from "@/lib/utils";
import mongoose from "mongoose";

const listingVariantSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    startingPrice: {
        type: Number,
        required: true,
    },
    pricingType: {
        type: String,
        enum: pricingType,
        default: 'fixed'
    },
    minPersons: {
        type: Number,
        default: 1,
        min: 1
    },
    points: [String],
    serviceCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
        }
    ],
    capacity: {
        type: Number
    },
    duration: {
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
    availability: {
        monday: { type: Boolean, default: true },
        tuesday: { type: Boolean, default: true },
        wednesday: { type: Boolean, default: true },
        thursday: { type: Boolean, default: true },
        friday: { type: Boolean, default: true },
        saturday: { type: Boolean, default: true },
        sunday: { type: Boolean, default: true },
    }
}, { timestamps: true })

const ListingVariantModel = mongoose.models.ListingVariant || mongoose.model('ListingVariant', listingVariantSchema, 'listingvariants')
export default ListingVariantModel