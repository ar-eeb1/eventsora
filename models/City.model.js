import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

citySchema.index({ state: 1, city: 1 }, { unique: true })

const CityModel = mongoose.models.City || mongoose.model('City', citySchema, 'cities')
export default CityModel