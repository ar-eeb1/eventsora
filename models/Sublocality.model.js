import mongoose from "mongoose";

const sublocalitySchema = new mongoose.Schema({
    locality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locality',
        required: true
    },
    sublocality: {
        type: String,
        unique: true,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

const SublocalityModel = mongoose.models?.Sublocality || mongoose.model('Sublocality', sublocalitySchema, 'sublocalities')
export default SublocalityModel