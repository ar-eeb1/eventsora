import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectDB } from "./databaseConnection";
import UserModel from "@/models/User.model";

//for multiple roles

export const isAuthenticated = async (roles) => {
    try {
        const cookieStore = await cookies();
        if (!cookieStore.has("access_token")) return { isAuth: false };

        const token = cookieStore.get("access_token").value;
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(payload.role)) return { isAuth: false };

        await connectDB()
        const user = await UserModel.findById(payload.userId).select('expireAt')
        
        if (user && user.expireAt && new Date() > new Date(user.expireAt)) {
            return { isAuth: true, userId: payload.userId, role: payload.role, isExpired: true };
        }

        return { isAuth: true, userId: payload.userId, role: payload.role, isExpired: false };
    } catch (error) {
        return { isAuth: false, error };
    }
};
