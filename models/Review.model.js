import mongoose from "mongoose";

const reviewScehma = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
})

const reviewModel = mongoose.models.Review || mongoose.model('Review', reviewScehma, "reviews")
export default reviewModel