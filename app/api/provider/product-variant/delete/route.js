import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'
import ProductVariantModel from '@/models/ProductVariant.Model'

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const { ids = [], deleteType } = await request.json()
        if (!Array.isArray(ids) || !ids.length || !ids.every(mongoose.isValidObjectId)) return response(false, 400, 'Invalid or empty ID list.')
        if (!['SD', 'RSD'].includes(deleteType)) return response(false, 400, 'Invalid delete operation.')
        await connectDB()
        const ownedProducts = await ProductModel.find({ userId: auth.userId }).select('_id').lean()
        const productIds = ownedProducts.map(({ _id }) => _id)
        await ProductVariantModel.updateMany({ _id: { $in: ids }, product: { $in: productIds } }, { $set: { deletedAt: deleteType === 'SD' ? new Date() : null } })
        return response(true, 200, deleteType === 'SD' ? 'Data moved into Trash' : 'Data restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const { ids = [], deleteType } = await request.json()
        if (!Array.isArray(ids) || !ids.length || !ids.every(mongoose.isValidObjectId) || deleteType !== 'PD') return response(false, 400, 'Invalid delete operation.')
        await connectDB()
        const ownedProducts = await ProductModel.find({ userId: auth.userId }).select('_id').lean()
        await ProductVariantModel.deleteMany({ _id: { $in: ids }, product: { $in: ownedProducts.map(({ _id }) => _id) }, deletedAt: { $ne: null } })
        return response(true, 200, 'Data deleted permanently')
    } catch (error) {
        return catchError(error)
    }
}
