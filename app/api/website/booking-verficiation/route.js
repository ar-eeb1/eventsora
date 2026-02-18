import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getVerifiedBookingData } from "@/lib/bookingVerification";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const bookingList = Array.isArray(payload) ? payload : (payload.data || [])

        const { listings, totalAmount } = await getVerifiedBookingData(bookingList)

        return response(true, 200, 'Verified booking data', { listings, totalAmount })
    } catch (error) {
        return catchError(error)
    }
}
