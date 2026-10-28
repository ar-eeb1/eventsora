import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import { NextResponse } from 'next/server'
import ProductVariantModel from '@/models/ProductVariant.Model'


export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 403 })

        await connectDB()
        const searchParams = request.nextUrl.searchParams
        const start = Math.max(parseInt(searchParams.get('start') || '0', 10), 0)
        const size = Math.min(Math.max(parseInt(searchParams.get('size') || '10', 10), 1), 100)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilter') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType')
        const userId = new mongoose.Types.ObjectId(auth.userId)
        const matchQuery = { userId }

        if (deleteType === 'PD') matchQuery.deletedAt = { $ne: null }
        else matchQuery.deletedAt = null

        if (globalFilter) {
            matchQuery.$or = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { sku: { $regex: globalFilter, $options: 'i' } },
                { 'categoryData.category': { $regex: globalFilter, $options: 'i' } },
                { 'subcategoryData.shopSubCategory': { $regex: globalFilter, $options: 'i' } },
                { 'cityData.city': { $regex: globalFilter, $options: 'i' } },
            ]
        }

        filters.forEach(({ id, value }) => {
            if (!id || id === 'userId' || value === '') return
            if (id === 'price') matchQuery[id] = Number(value)
            else matchQuery[id] = { $regex: value, $options: 'i' }
        })

        const sortQuery = {}
        sorting.forEach(({ id, desc }) => { sortQuery[id] = desc ? -1 : 1 })
        const pipeline = [
            { $lookup: { from: 'shopcategories', localField: 'category', foreignField: '_id', as: 'categoryData' } },
            { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'shopsubcategories', localField: 'subcategory', foreignField: '_id', as: 'subcategoryData' } },
            { $unwind: { path: '$subcategoryData', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'cityData' } },
            { $unwind: { path: '$cityData', preserveNullAndEmptyArrays: true } },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1, name: 1, slug: 1, price: 1, sku: 1, status: 1, tags: 1,
                    category: '$categoryData.category',
                    subcategory: '$subcategoryData.shopSubCategory',
                    city: '$cityData.city', deletedAt: 1,
                }
            },
        ]
        const data = await ProductModel.aggregate(pipeline)
        const totalRowCount = await ProductModel.countDocuments(matchQuery)
        return NextResponse.json({ success: true, data, meta: { totalRowCount } })
    } catch (error) {
        return catchError(error)
    }
}