import mongoose from "mongoose";

const reviewScehma = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

reviewScehma.pre('validate', function (next) {
    const targets = [this.listing, this.product].filter(Boolean)
    if (targets.length !== 1) {
        return next(new Error('A review must belong to exactly one listing or product.'))
    }
    next()
})

const reviewModel = mongoose.models.Review || mongoose.model('Review', reviewScehma, "reviews")
export default reviewModel