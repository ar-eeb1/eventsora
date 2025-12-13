import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import UserModel from "@/models/user.Model";


export async function POST(request) {
    const payload = await request.json();
    try {
        const auth = await isAuthenticated("provider");

        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }
      
        await connectDB();

        const mediaWithUserId = payload.map(item => ({
            ...item,
            userId: auth.userId   // this must be a string, not object
        }));

        const newMedia = await MediaModel.insertMany(mediaWithUserId);


        return response(true, 200, "Media uploaded successfully", newMedia);

    } catch (error) {

        return catchError(error);
    }
}