import mongoose from "mongoose";

const businessProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    bankDetails: {
        bankName: String,
        accountHolderName: String,
        accountNumber: String,
        iban: String,
        lastUpdate: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

const BusinessProfileModel = mongoose.models.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema, 'businessProfiles')
export default BusinessProfileModel