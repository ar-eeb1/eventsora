import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

const CountryModel = mongoose.models.Country || mongoose.model('Country', countrySchema, 'countries')
export default CountryModel