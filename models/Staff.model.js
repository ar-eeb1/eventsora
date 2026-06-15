import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
            default: "",
        },
        salaryType: {
            type: String,
            enum: ["monthly", "per_event"],
            default: "monthly",
        },
        salaryAmount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        availabilityStatus: {
            type: String,
            enum: ["available", "busy", "off"],
            default: "available",
        },
    },
    { timestamps: true }
);

staffSchema.index({ providerId: 1, createdAt: -1 });

const StaffModel = mongoose.models.Staff || mongoose.model("Staff", staffSchema, "staff");
export default StaffModel;
