// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import CalendarModel from "@/models/Calendar.model";

// export async function GET(request) {
//     try {
//         await connectDB();

//         const { searchParams } = new URL(request.url);
//         const listingId = searchParams.get('listingId');

//         if (!listingId) {
//             return response(false, 400, 'Listing ID is required.');
//         }

//         // Fetch all calendar entries for this listing
//         const calendarData = await CalendarModel.find({ 
//             listingId,
//             deletedAt: null  // Only fetch non-deleted entries
//         })
//         .sort({ date: 1 })
//         .lean();

//         return response(true, 200, 'Calendar data fetched successfully.', calendarData);

//     } catch (error) {
//         return catchError(error);
//     }
// }

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CalendarModel from "@/models/Calendar.model";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const listingId = searchParams.get('listingId');
        const variantId = searchParams.get('variantId');

        // Listing ID is required
        if (!listingId) {
            return response(false, 400, 'Listing ID is required.');
        }

        // Fetch calendar entries by listingId or variantId
        let query = { deletedAt: null };

        if (listingId) query.listingId = listingId;
        if (variantId) query.variantId = variantId;

        const calendarData = await CalendarModel.find(query)
            .sort({ date: 1 })
            .lean();

        return response(true, 200, 'Calendar data fetched successfully.', calendarData);

    } catch (error) {
        return catchError(error);
    }
}
