import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";

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

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty ID list.')
        }

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const listings = await ListingModel.find({ _id: { $in: ids }, userId: userObjectId }).select('media').lean()
        if (!listings.length) {
            return response(false, 404, 'Data not found or access denied.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete operation.')
        }

        const mediaIds = listings.flatMap(l => l.media || []).filter(Boolean);

        if (deleteType === 'SD') {
            await ListingModel.updateMany({ _id: { $in: ids }, userId: userObjectId }, { $set: { deletedAt: new Date().toISOString() } })
            if (mediaIds.length > 0) {
                await MediaModel.updateMany({ _id: { $in: mediaIds } }, { $set: { deletedAt: new Date().toISOString() } })
            }
        } else {
            await ListingModel.updateMany({ _id: { $in: ids }, userId: userObjectId }, { $set: { deletedAt: null } })
            if (mediaIds.length > 0) {
                await MediaModel.updateMany({ _id: { $in: mediaIds } }, { $set: { deletedAt: null } })
            }
        }

        return response(true, 200, deleteType === 'SD' ? 'Data moved into Trash' : 'Data Restored')

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

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty ID list.')
        }

        const listings = await ListingModel.find({ _id: { $in: ids } }).select('media').lean()
        if (!listings.length) {
            return response(false, 404, 'Data not found.')
        }

        if (deleteType !== 'PD') {
            return response(false, 400, 'Invalid delete operation.')
        }

        const mediaIds = listings.flatMap(l => l.media || []).filter(Boolean);

        if (mediaIds.length > 0) {
            const medias = await MediaModel.find({ _id: { $in: mediaIds } }).lean();
            const publicIds = medias.map(m => m.public_id).filter(Boolean);

            if (publicIds.length > 0) {
                try {
                    await cloudinary.api.delete_resources(publicIds);
                } catch (err) {
                    console.error('Cloudinary deletion error:', err);
                }
            }

            await MediaModel.deleteMany({ _id: { $in: mediaIds } });
        }

        await ListingModel.deleteMany({ _id: { $in: ids } })
        return response(true, 200, 'Data Deleted Permanently')

    } catch (error) {

        return catchError(error)
    }
}