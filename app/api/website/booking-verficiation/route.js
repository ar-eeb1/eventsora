import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const bookingList = Array.isArray(payload) ? payload : (payload.data || [])

        const verifiedBookingData = await Promise.all(
            bookingList.map(async (bookingItem) => {
                let data = null;

                // 1. Try to find by variantId first if provided
                if (bookingItem.variantId) {
                    const variant = await ListingVariantModel.findById(bookingItem.variantId)
                        .populate({
                            path: 'listingId',
                            populate: {
                                path: 'media',
                                select: 'secure_url'
                            }
                        })
                        .populate('media', 'secure_url')
                        .lean();

                    if (variant && variant.listingId) {
                        data = {
                            listingId: variant.listingId._id,
                            variantId: variant._id,
                            name: variant.listingId.name,
                            listingName: variant.listingId.name, // Frontend uses listingName
                            url: variant.listingId.slug,
                            slug: variant.listingId.slug,
                            price: variant.price,
                            variantPrice: variant.price, // Frontend uses variantPrice
                            startingPrice: variant.listingId.startingPrice,
                            media: variant?.media[0]?.secure_url,
                            thumbnail: variant?.media[0] || variant?.listingId?.media[0], // Frontend uses thumbnail
                            variantTitle: variant.title, // Frontend uses variantTitle
                            quantity: bookingItem.quantity
                        };
                    }
                }

                // 2. If no variant found or no variantId, try finding by listingId
                if (!data && bookingItem.listingId) {
                    const listing = await ListingModel.findById(bookingItem.listingId)
                        .populate('media', 'secure_url')
                        .lean();

                    if (listing) {
                        data = {
                            listingId: listing._id,
                            variantId: null,
                            name: listing.name,
                            listingName: listing.name,
                            url: listing.slug,
                            slug: listing.slug,
                            price: listing.startingPrice,
                            variantPrice: listing.startingPrice,
                            startingPrice: listing.startingPrice,
                            media: listing?.media[0]?.secure_url,
                            thumbnail: listing?.media[0],
                            variantTitle: null,
                            quantity: bookingItem.quantity
                        };
                    }
                }

                return data;
            })
        )

        // Filter out null values (where neither variant nor listing was found)
        const finalVerifiedData = verifiedBookingData.filter(item => item !== null);

        // Calculate total amount
        const totalAmount = finalVerifiedData.reduce((total, item) => {
            const price = item.variantPrice || item.startingPrice || 0;
            const quantity = item.variantTitle === null ? 1 : (item.quantity || 1);
            return total + (price * quantity);
        }, 0);

        return response(true, 200, 'Verified booking data', { listings: finalVerifiedData, totalAmount })
    } catch (error) {
        return catchError(error)
    }
}