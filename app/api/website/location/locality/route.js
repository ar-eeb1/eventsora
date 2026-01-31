import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import LocalityModel from "@/models/Locality.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const cityId = searchParams.get('city')
        const query = { deletedAt: null }
        if (cityId) {
            query.city = { $in: cityId.split(',') }
        }

        const localities = await LocalityModel.find(query).select("_id locality").sort({ locality: 1 }).lean()
        if (!localities) return NextResponse.json({ message: "No localities found", success: false })

        return NextResponse.json({ data: localities, success: true })

    } catch (error) {
        return catchError(error)
    }
}