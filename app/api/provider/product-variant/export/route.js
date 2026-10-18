import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError } from '@/lib/helperFunction'
import ProductVariantModel from '@/models/ProductVariant.Model'
import ProductModel from '@/models/Product.Model'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 403 })
        await connectDB()
        const products = await ProductModel.find({ userId: auth.userId }).select('_id').lean()
        const data = await ProductVariantModel.find({ product: { $in: products.map(({ _id }) => _id) }, deletedAt: null })
            .populate('product', 'name').sort({ createdAt: -1 }).lean()
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return catchError(error)
    }
}
