import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }
        await connectDB()
        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids || ids.length === 0)) {
            return response(false, 403, 'Invalid or empty ID list.')
        }

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const listing = await ListingModel.find({ _id: { $in: ids }, userId: userObjectId }).lean()
        if (!listing.length) {
            return response(false, 404, 'Data not found or access denied.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete operation.')
        }

        if (deleteType === 'SD') {
            await ListingModel.updateMany({ _id: { $in: ids }, userId: userObjectId }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await ListingModel.updateMany({ _id: { $in: ids }, userId: userObjectId }, { $set: { deletedAt: null } })
        }

        return response(true, 200, deleteType === 'SD' ? 'Data mode into Trash' : 'Data Restored')

    } catch (error) {
        return catchError(error)
    }
}

// DELETE PERMANENTLY

export async function DELETE(request) {

    try {
        const auth = await isAuthenticated('master')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }
        await connectDB()
        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids || ids.length === 0)) {
            return response(false, 403, 'Invalid or empty ID list.')
        }

        const listing = await ListingModel.find({ _id: { $in: ids } }).lean()
        if (!listing.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delete operation.')
        }

        await ListingModel.deleteMany({ _id: { $in: ids } })
          return response(true, 200, 'Data Deleted Permanently')

    } catch (error) {

        return catchError(error)
    }
}