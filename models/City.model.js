import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.ObjectId,
        ref: 'State',
        required: true
    },
    city: {
        type: String,
        required: true,
        unique: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

const CityModel = mongoose.models.City || mongoose.model('City', citySchema, 'cities')
export default CityModel