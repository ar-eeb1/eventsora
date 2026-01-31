
import { dateStatus } from "@/lib/utils";
import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema(
    {
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        dateStatus: {
            type: String,
            enum: dateStatus, // ['available', 'booked', 'blocked']
            default: "available",
            index: true,
        },
        price: {
            type: Number,
            default: null, // optional dynamic pricing
        },
        // bookingId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Booking",
        //     default: null,
        // },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ListingVariant",
            default: null
        }
    },
    { timestamps: true }
);

CalendarSchema.index({ listingId: 1, variantId: 1, date: 1 }, { unique: true });

const CalendarModel = mongoose.models.Calendar || mongoose.model("Calendar", CalendarSchema, "calendar");

export default CalendarModel;