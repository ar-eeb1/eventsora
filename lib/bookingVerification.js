import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import CalendarModel from "@/models/Calendar.model";

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
                    const variantPrice = variant.startingPrice;
                    const quantity = bookingItem.quantity || 1;
                    const variantTotal = variantPrice * quantity;

                    // Fetch calendar prices for selected dates
                    let calendarPriceTotal = 0;
                    let actualPrice = variantTotal;
                    let discount = 0;

                    if (bookingItem.bookingDate?.length > 0) {
                        const dateConditions = bookingItem.bookingDate.map(d => {
                            const start = new Date(d + 'T00:00:00.000Z');
                            const end = new Date(start.getTime() + 86400000);
                            return { date: { $gte: start, $lt: end } };
                        });
                        // Try variant-specific first, then listing-level (variantId: null)
                        let calendarEntries = await CalendarModel.find({
                            listingId: variant.listingId._id,
                            variantId: variant._id,
                            $or: dateConditions,
                            deletedAt: null
                        }).lean();
                        if (calendarEntries.length === 0) {
                            calendarEntries = await CalendarModel.find({
                                listingId: variant.listingId._id,
                                variantId: null,
                                $or: dateConditions,
                                deletedAt: null
                            }).lean();
                        }

                        const dateToPrice = {};
                        calendarEntries.forEach(entry => {
                            const dateKey = entry.date.toISOString().split('T')[0];
                            if (entry.price != null) dateToPrice[dateKey] = entry.price;
                        });

                        const calendarPricePerUnit = bookingItem.bookingDate.reduce((sum, dateKey) => {
                            const price = dateToPrice[dateKey];
                            return sum + (price != null ? Number(price) : 0);
                        }, 0);

                        // For per_person/per_hour/per_day: calendar price is PER UNIT; multiply by quantity for total
                        const isVariablePricing = (pt) => pt === 'per_person' || pt === 'per_hour' || pt === 'per_day';
                        calendarPriceTotal = isVariablePricing(variant.pricingType)
                            ? calendarPricePerUnit * quantity
                            : calendarPricePerUnit;

                        if (calendarPriceTotal > 0 && calendarPriceTotal < variantTotal) {
                            actualPrice = calendarPriceTotal;
                            discount = variantTotal - calendarPriceTotal;
                        }
                    }

                    // Store unit price (per person/hour/day) for consistency
                    const unitPrice = quantity > 0 ? actualPrice / quantity : variantPrice;

                    data = {
                        listingId: variant.listingId._id,
                        variantId: variant._id,
                        name: variant.listingId.name,
                        listingName: variant.listingId.name,
                        url: variant.listingId.slug,
                        slug: variant.listingId.slug,
                        price: unitPrice,
                        variantPrice: variantPrice,
                        startingPrice: variant.listingId.startingPrice,
                        calendarPrice: calendarPriceTotal > 0 ? calendarPriceTotal : null,
                        discount: discount || null,
                        pricingType: variant.pricingType,
                        media: variant?.media[0]?.secure_url || variant?.listingId?.media[0]?.secure_url,
                        thumbnail: variant?.media[0] || variant?.listingId?.media[0],
                        variantTitle: variant.title,
                        quantity: bookingItem.quantity,
                        bookingDate: bookingItem.bookingDate?.map(d => typeof d === 'string' ? d.split('T')[0] : new Date(d).toISOString().split('T')[0]),
                        ownerEmail: variant.listingId.userId?.email,
                        ownerName: variant.listingId.userId?.name,
                        ownerId: variant.listingId.userId?._id
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
                    const listingPrice = listing.startingPrice;
                    const quantity = bookingItem.quantity || 1;
                    const listingTotal = listingPrice * quantity;

                    let calendarPriceTotal = 0;
                    let actualPrice = listingTotal;
                    let discount = 0;

                    if (bookingItem.bookingDate?.length > 0) {
                        const dateConditions = bookingItem.bookingDate.map(d => {
                            const start = new Date(d + 'T00:00:00.000Z');
                            const end = new Date(start.getTime() + 86400000);
                            return { date: { $gte: start, $lt: end } };
                        });
                        const calendarEntries = await CalendarModel.find({
                            listingId: listing._id,
                            variantId: null,
                            $or: dateConditions,
                            deletedAt: null
                        }).lean();

                        const dateToPrice = {};
                        calendarEntries.forEach(entry => {
                            const dateKey = entry.date.toISOString().split('T')[0];
                            if (entry.price != null) dateToPrice[dateKey] = entry.price;
                        });

                        calendarPriceTotal = bookingItem.bookingDate.reduce((sum, dateKey) => {
                            const price = dateToPrice[dateKey];
                            return sum + (price != null ? Number(price) : 0);
                        }, 0);

                        if (calendarPriceTotal > 0 && calendarPriceTotal < listingTotal) {
                            actualPrice = calendarPriceTotal;
                            discount = listingTotal - calendarPriceTotal;
                        }
                    }

                    const unitPrice = quantity > 0 ? actualPrice / quantity : listingPrice;

                    data = {
                        listingId: listing._id,
                        variantId: null,
                        name: listing.name,
                        listingName: listing.name,
                        url: listing.slug,
                        slug: listing.slug,
                        price: unitPrice,
                        variantPrice: listingPrice,
                        startingPrice: listing.startingPrice,
                        pricingType: 'fixed',
                        calendarPrice: calendarPriceTotal > 0 ? calendarPriceTotal : null,
                        discount: discount || null,
                        media: listing?.media[0]?.secure_url,
                        thumbnail: listing?.media[0],
                        variantTitle: null,
                        quantity: bookingItem.quantity,
                        bookingDate: bookingItem.bookingDate?.map(d => typeof d === 'string' ? d.split('T')[0] : new Date(d).toISOString().split('T')[0]),
                        ownerEmail: listing.userId?.email,
                        ownerName: listing.userId?.name,
                        ownerId: listing.userId?._id
                    };
                }
            }

            return data;
        })
    );

    // Filter out null values
    const finalVerifiedData = verifiedBookingData.filter(item => item !== null);

    // Calculate total amount (price is unit price, multiply by quantity)
    const isVariablePricing = (pt) => pt === 'per_person' || pt === 'per_hour' || pt === 'per_day';
    const totalAmount = finalVerifiedData.reduce((total, item) => {
        const price = item.price || item.variantPrice || item.startingPrice || 0;
        const quantity = isVariablePricing(item.pricingType) ? (item.quantity || 1) : 1;
        return total + (price * quantity);
    }, 0);

    return { listings: finalVerifiedData, totalAmount };
}
