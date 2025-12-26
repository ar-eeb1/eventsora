import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CalendarModel from "@/models/Calendar.model";
import { zSchema } from "@/lib/zodSchema";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }
        
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const listingId = searchParams.get('listingId');

        if (!listingId) {
            return response(false, 400, 'Listing ID is required.');
        }

        // Fetch all calendar entries for this listing
        const calendarData = await CalendarModel.find({ listingId })
            .sort({ date: 1 }) // Sort by date ascending
            .lean();

        return response(true, 200, 'Calendar data fetched successfully.', calendarData);

    } catch (error) {
        return catchError(error);
    }
}

export async function POST(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }
        await connectDB();
        const payload = await request.json();
        const schema = zSchema.pick({
            listingId: true,
            date: true,
            dateStatus: true,
            price: true,
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const { listingId, date, dateStatus, price } = validate.data;

        const updated = await CalendarModel.findOneAndUpdate(
            { listingId, date },
            { dateStatus, price },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return response(true, 200, 'Listing calendar updated.', updated);

    } catch (error) {
        return catchError(error);
    }
}

// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { isAuthenticated } from "@/lib/authentication";
// import { zSchema } from "@/lib/zodSchema";
// import CalendarModel from "@/models/Calendar.model";

// export async function POST(request) {
//     try {
//         const auth = await isAuthenticated('provider');
//         if (!auth.isAuth) {
//             return response(false, 403, 'Unauthorized.');
//         }
//         await connectDB();
//         const payload = await request.json();
//         const schema = zSchema.pick({
//             listingId: true,
//             date: true,
//             dateStatus: true,
//             price: true,
//         });

//         const validate = schema.safeParse(payload);
//         if (!validate.success) {
//             return response(false, 400, 'Invalid or missing fields.', validate.error);
//         }

//         const { listingId, date, dateStatus, price } = validate.data;

//         const updated = await CalendarModel.findOneAndUpdate(
//             { listingId, date },
//             { dateStatus, price },
//             { upsert: true, new: true, setDefaultsOnInsert: true }
//         );

//         return response(true, 200, 'Listing calendar updated.', updated);

//     } catch (error) {
//         return catchError(error);
//     }
// }
