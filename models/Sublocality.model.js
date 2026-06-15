import mongoose from "mongoose";

const sublocalitySchema = new mongoose.Schema({
    locality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locality',
        required: true
    },
    sublocality: {
        type: String,
        trim: true,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

sublocalitySchema.index({ locality: 1, sublocality: 1 }, { unique: true })

const SublocalityModel = mongoose.models?.Sublocality || mongoose.model('Sublocality', sublocalitySchema, 'sublocalities')
export default SublocalityModel