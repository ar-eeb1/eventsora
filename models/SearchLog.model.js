import mongoose from "mongoose"

const searchLogSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    category: {
        type: String,
        default: null,
    },
    subcategory: {
        type: String,
        default: null,
    },
    resultsCount: {
        type: Number,
        default: 0,
    },
    ip: {
        type: String,
        default: null,
    },
}, { timestamps: true })

// Index for fast aggregation queries
searchLogSchema.index({ query: 1 })
searchLogSchema.index({ createdAt: -1 })

const SearchLogModel = mongoose.models.SearchLog || mongoose.model('SearchLog', searchLogSchema, 'searchlogs')
export default SearchLogModel
