import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CalendarModel from "@/models/Calendar.model";
import { zSchema } from "@/lib/zodSchema";

export async function GET(request) {
    try {
        // Auth check
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const listingId = searchParams.get('listingId');
        const variantId = searchParams.get('variantId');

        // At least one ID is required
        if (!listingId && !variantId) {
            return response(false, 400, 'Either listingId or variantId is required.');
        }

        // Build query
        const query = { deletedAt: null };
        if (listingId) query.listingId = listingId;
        if (variantId) query.variantId = variantId;

        // Fetch calendar entries
        const calendarData = await CalendarModel.find(query)
            .sort({ date: 1 })
            .lean();

        return response(true, 200, 'Calendar data fetched successfully.', calendarData);

    } catch (error) {
        return catchError(error);
    }
}

export async function POST(request) {
    try {
        // Auth check
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();

        const payload = await request.json();

        // Updated schema to include variantId as optional
        const schema = zSchema.pick({
            listingId: true,
            variantId: true, // optional
            date: true,
            dateStatus: true,
            price: true,
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const { listingId, variantId, date, dateStatus, price } = validate.data;

        // Build filter for findOneAndUpdate
        const filter = { date, deletedAt: null };
        if (listingId) filter.listingId = listingId;

        // Handle variantId specifically
        if (variantId) {
            filter.variantId = variantId;
        } else {
            // Explicitly look for null if no variantId provided to avoid mixing main listing and variants
            filter.variantId = null;
        }

        const updated = await CalendarModel.findOneAndUpdate(
            filter,
            { dateStatus, price, listingId, variantId: variantId || null },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return response(true, 200, 'Listing calendar updated.', updated);

    } catch (error) {
        return catchError(error);
    }
}
