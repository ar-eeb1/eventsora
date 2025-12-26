import { jwtVerify } from "jose"
import { cookies } from "next/headers"

// export const isAuthenticated = async (role) => {
//     try {
//         const cookieStore = await cookies();
//         if (!cookieStore.has("access_token")) return { isAuth: false };

//         const token = cookieStore.get("access_token").value;
//         const secret = new TextEncoder().encode(process.env.SECRET_KEY);
//         const { payload } = await jwtVerify(token, secret);

//         if (payload.role !== role) return { isAuth: false };

//         return {
//             isAuth: true,
//             userId: payload.userId
//         };
//     } catch (error) {
//         return { isAuth: false, error };
//     }
// };

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

        return { isAuth: true, userId: payload.userId, role: payload.role };
    } catch (error) {
        return { isAuth: false, error };
    }
};
