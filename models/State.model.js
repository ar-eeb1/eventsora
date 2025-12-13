import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.ObjectId,
        ref: 'Country',
        required: true
    },
    state: {
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

const StateModel = mongoose.models.State || mongoose.model('State', stateSchema, 'states')
export default StateModel