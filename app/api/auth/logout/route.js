import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(params) {
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.set({
            name: 'access_token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
            ...(process.env.NODE_ENV === 'production' ? { domain: '.eventsora.com' } : {}),
        })
        return response(true, 200, 'Logout Successfully')
    } catch (error) {
        return catchError(error)
    }
}