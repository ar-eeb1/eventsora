import { bookingStatus, paymentStatus } from "@/lib/utils";
import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String, // String to handle leading zeros or formatted numbers
        required: true
    },
    note: {
        type: String,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    advance: {
        type: Number,
        default: 0
    },
    receivedAmount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        default: 'Online'
    },
    paymentStatus: {
        type: String,
        enum: paymentStatus,
        default: 'pending'
    },
    eventType: {
        type: String,
        required: false
    },
    timeSlot: {
        type: String,
        required: false
    },
    guestCount: {
        type: Number,
        required: false
    },
    bookingSource: {
        type: String,
        enum: ['website', 'manual'],
        default: 'website'
    },
    listings: [
        {
            listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
            variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ListingVariant', required: false },
            slug: { type: String, required: true },
            name: { type: String, required: true },
            variantTitle: { type: String, required: false },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            bookingDate: [{ type: String, required: true }],
            media: { type: String, required: false },
            variantPrice: { type: Number, required: false },
            discount: { type: Number, required: false },
        }
    ],
    bookingStatus: {
        type: String,
        enum: bookingStatus,
        default: 'pending'
    },
    booking_id: {
        type: String,
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    review: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false
    },


}, { timestamps: true })


const bookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema, 'bookings')
export default bookingModel