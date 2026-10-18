import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError } from '@/lib/helperFunction'
import ProductVariantModel from '@/models/ProductVariant.Model'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 403 })

        await connectDB()
        const params = request.nextUrl.searchParams
        const start = Math.max(parseInt(params.get('start') || '0', 10), 0)
        const size = Math.min(Math.max(parseInt(params.get('size') || '10', 10), 1), 100)
        const filters = JSON.parse(params.get('filters') || '[]')
        const sorting = JSON.parse(params.get('sorting') || '[]')
        const globalFilter = params.get('globalFilter') || ''
        const deleteType = params.get('deleteType')
        const userId = new mongoose.Types.ObjectId(auth.userId)
        const match = { 'productData.userId': userId, deletedAt: deleteType === 'PD' ? { $ne: null } : null }

        if (globalFilter) {
            match.$or = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { sku: { $regex: globalFilter, $options: 'i' } },
                { 'productData.name': { $regex: globalFilter, $options: 'i' } },
            ]
        }
        filters.forEach(({ id, value }) => {
            if (!id || value === '') return
            match[id] = ['price', 'stockQuantity'].includes(id) ? Number(value) : { $regex: value, $options: 'i' }
        })
        const sort = {}
        sorting.forEach(({ id, desc }) => { sort[id] = desc ? -1 : 1 })
        const pipeline = [
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productData' } },
            { $unwind: '$productData' },
            { $match: match },
            { $sort: Object.keys(sort).length ? sort : { createdAt: -1 } },
            { $facet: {
                data: [
                    { $skip: start }, { $limit: size },
                    { $project: { _id: 1, product: '$productData.name', productId: '$productData._id', name: 1, sku: 1, price: 1, stockType: 1, stockQuantity: 1, status: 1, deletedAt: 1 } }
                ],
                meta: [{ $count: 'totalRowCount' }]
            } }
        ]
        const [result] = await ProductVariantModel.aggregate(pipeline)
        return NextResponse.json({ success: true, data: result.data, meta: { totalRowCount: result.meta[0]?.totalRowCount || 0 } })
    } catch (error) {
        return catchError(error)
    }
}
