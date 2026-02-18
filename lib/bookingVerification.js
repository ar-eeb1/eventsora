import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function getVerifiedBookingData(bookingList) {
    const verifiedBookingData = await Promise.all(
        bookingList.map(async (bookingItem) => {
            let data = null;

            // 1. Try to find by variantId first if provided
            if (bookingItem.variantId) {
                const variant = await ListingVariantModel.findById(bookingItem.variantId)
                    .populate({
                        path: 'listingId',
                        populate: [
                            {
                                path: 'media',
                                select: 'secure_url'
                            },
                            {
                                path: 'userId',
                                select: 'email name'
                            }
                        ]
                    })
                    .populate('media', 'secure_url')
                    .lean();

                if (variant && variant.listingId) {
                    data = {
                        listingId: variant.listingId._id,
                        variantId: variant._id,
                        name: variant.listingId.name,
                        listingName: variant.listingId.name,
                        url: variant.listingId.slug,
                        slug: variant.listingId.slug,
                        price: variant.price,
                        variantPrice: variant.price,
                        startingPrice: variant.listingId.startingPrice,
                        media: variant?.media[0]?.secure_url || variant?.listingId?.media[0]?.secure_url,
                        thumbnail: variant?.media[0] || variant?.listingId?.media[0],
                        variantTitle: variant.title,
                        quantity: bookingItem.quantity,
                        bookingDate: bookingItem.bookingDate,
                        ownerEmail: variant.listingId.userId?.email,
                        ownerName: variant.listingId.userId?.name
                    };
                }
            }

            // 2. If no variant found or no variantId, try finding by listingId
            if (!data && bookingItem.listingId) {
                const listing = await ListingModel.findById(bookingItem.listingId)
                    .populate('media', 'secure_url')
                    .populate('userId', 'email name')
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
                        quantity: bookingItem.quantity,
                        bookingDate: bookingItem.bookingDate,
                        ownerEmail: listing.userId?.email,
                        ownerName: listing.userId?.name
                    };
                }
            }

            return data;
        })
    );

    // Filter out null values
    const finalVerifiedData = verifiedBookingData.filter(item => item !== null);

    // Calculate total amount
    const totalAmount = finalVerifiedData.reduce((total, item) => {
        const price = item.variantPrice || item.startingPrice || 0;
        // If variantTitle is null, quantity is usually 1 (like a banquet hall), 
        // but let's respect the item.quantity if it's per_person or similar logic from previous route
        // Previous route logic: const quantity = item.variantTitle === null ? 1 : (item.quantity || 1);
        // However, some listings might have quantity even without variants (e.g. per_person pricing without variants)
        // I'll stick to the previous logic for consistency for now, but maybe it needs adjustment.
        const quantity = item.variantTitle === null ? 1 : (item.quantity || 1);
        return total + (price * quantity);
    }, 0);

    return { listings: finalVerifiedData, totalAmount };
}
