import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import CityModel from "@/models/City.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB()
        const cities = await CityModel.find({ deletedAt: null }).select("_id city").sort({ city: 1 }).lean()
        if (!cities) return NextResponse.json({ message: "No cities found", success: false })
        return NextResponse.json({ data: cities, success: true })
    } catch (error) {
        return catchError(error)
    }
}
