import mongoose from "mongoose";

const sublocalitySchema = new mongoose.Schema({
    locality: {
        type: mongoose.Schema.ObjectId,
        ref: 'Locality',
        required: true
    },
    sublocality: {
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

const SublocalityModel = mongoose.models.Sublocality || mongoose.model('Sublocality', sublocalitySchema, 'sublocalities')
export default SublocalityModel