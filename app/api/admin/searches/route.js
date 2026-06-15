import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import SearchLogModel from "@/models/SearchLog.model";

export async function GET(request) {
    try {
        // const auth = await isAuthenticated('admin');
        // if (!auth.isAuth) {
        //     return response(false, 403, 'Unauthorized.');
        // }

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days')) || 30;

        const since = new Date();
        since.setDate(since.getDate() - days);

        // Run all aggregations in parallel
        const [topSearches, dailyVolume, zeroResults, totalSearches] = await Promise.all([

            // Top searched keywords (grouped + counted)
            SearchLogModel.aggregate([
                { $match: { createdAt: { $gte: since } } },
                {
                    $group: {
                        _id: '$query',
                        count: { $sum: 1 },
                        avgResults: { $avg: '$resultsCount' },
                        lastSearched: { $max: '$createdAt' },
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 20 },
                {
                    $project: {
                        _id: 0,
                        query: '$_id',
                        count: 1,
                        avgResults: { $round: ['$avgResults', 0] },
                        lastSearched: 1,
                    }
                }
            ]),

            // Daily search volume (last N days)
            SearchLogModel.aggregate([
                { $match: { createdAt: { $gte: since } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, date: '$_id', count: 1 } }
            ]),

            // Searches with 0 results (no listings matched)
            SearchLogModel.aggregate([
                { $match: { createdAt: { $gte: since }, resultsCount: 0 } },
                {
                    $group: {
                        _id: '$query',
                        count: { $sum: 1 },
                        lastSearched: { $max: '$createdAt' },
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 0,
                        query: '$_id',
                        count: 1,
                        lastSearched: 1,
                    }
                }
            ]),

            // Total search count in date range
            SearchLogModel.countDocuments({ createdAt: { $gte: since } }),
        ]);

        return response(true, 200, 'Search Analytics', {
            topSearches,
            dailyVolume,
            zeroResults,
            totalSearches,
            days,
        });
    } catch (error) {
        return catchError(error);
    }
}
