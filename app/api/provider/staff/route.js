import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import StaffModel from "@/models/Staff.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated(["master", "provider"]);
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const providerId = new mongoose.Types.ObjectId(auth.userId);
        const searchParams = request.nextUrl.searchParams;
        const start = parseInt(searchParams.get("start") || 0, 10);
        const size = parseInt(searchParams.get("size") || 100, 10);

        const [staff, totalRowCount] = await Promise.all([
            StaffModel.find({ providerId })
                .sort({ createdAt: -1 })
                .skip(start)
                .limit(size)
                .lean(),
            StaffModel.countDocuments({ providerId }),
        ]);


        return response(true, 200, "Staff fetched successfully.", { staff, totalRowCount });
    } catch (error) {
        return catchError(error);
    }
}

export async function POST(request) {
    try {
        const auth = await isAuthenticated(["master", "provider"]);
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const body = await request.json();
        const providerId = new mongoose.Types.ObjectId(auth.userId);

        if (!body.fullName?.trim()) {
            return response(false, 400, "Full name is required.");
        }

        const staff = await StaffModel.create({
            fullName: body.fullName.trim(),
            phone: body.phone?.trim() || "",
            role: body.role?.trim() || "",
            salaryType: body.salaryType || "monthly",
            salaryAmount: Number(body.salaryAmount) || 0,
            isActive: body.isActive !== false,
            availabilityStatus: body.availabilityStatus || "available",
            providerId,
        });

        return response(true, 201, "Staff added successfully.", staff);
    } catch (error) {
        return catchError(error);
    }
}
