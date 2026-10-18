import mongoose from 'mongoose'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ProductModel from '@/models/Product.Model'

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const { ids = [], deleteType } = await request.json()
        if (!Array.isArray(ids) || !ids.length || !ids.every(mongoose.isValidObjectId)) return response(false, 400, 'Invalid or empty ID list.')
        if (!['SD', 'RSD'].includes(deleteType)) return response(false, 400, 'Invalid delete operation.')
        await connectDB()
        await ProductModel.updateMany(
            { _id: { $in: ids }, userId: auth.userId },
            { $set: { deletedAt: deleteType === 'SD' ? new Date() : null } }
        )
        return response(true, 200, deleteType === 'SD' ? 'Data moved into Trash' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')
        const { ids = [], deleteType } = await request.json()
        if (!Array.isArray(ids) || !ids.length || !ids.every(mongoose.isValidObjectId)) return response(false, 400, 'Invalid or empty ID list.')
        if (deleteType !== 'PD') return response(false, 400, 'Invalid delete operation.')
        await connectDB()
        await ProductModel.deleteMany({ _id: { $in: ids }, userId: auth.userId, deletedAt: { $ne: null } })
        return response(true, 200, 'Data Deleted Permanently')
    } catch (error) {
        return catchError(error)
    }
}