import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized....");
        }

        const payload = await request.json();
        const items = Array.isArray(payload) ? payload : [payload];

        await connectDB();
        const mediaWithUserId = items.map(item => ({
            userId: auth.userId,
            asset_id: item.asset_id || item.public_id,
            public_id: item.public_id,
            secure_url: item.secure_url,
            path: item.path || item.public_id,
            thumbnail_url: item.thumbnail_url || item.secure_url,
            alt: item.alt || '',
            title: item.title || '',
        }));

        const newMedia = await MediaModel.insertMany(mediaWithUserId);

        return response(true, 200, "Media uploaded successfully", newMedia);

    } catch (error) {
        return catchError(error);
    }
}