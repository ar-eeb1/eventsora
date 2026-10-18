import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 403 })
        await connectDB()
        const data = await ProductModel.find({ userId: auth.userId, deletedAt: null }).select('_id name').sort({ name: 1 }).lean()
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return catchError(error)
    }
}
