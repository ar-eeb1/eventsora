import mongoose from "mongoose";

const localitySchema = new mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    locality: {
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

const LocalityModel = mongoose.models.Locality || mongoose.model('Locality', localitySchema, 'localities')
export default LocalityModel