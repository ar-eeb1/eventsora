import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    count: 0,
    listings: []
}
export const bookingReducer = createSlice({
    name: 'bookingStore',
    initialState,
    reducers: {
        addIntoBooking: (state, action) => {
            const payload = action.payload
            const existingBooking = state.listings.findIndex(
                (listing) => listing.listingId === payload.listingId &&
                    listing.variantId === payload.variantId &&
                    JSON.stringify([...(listing.bookingDate || [])].sort()) === JSON.stringify([...(payload.bookingDate || [])].sort())
            )

            if (existingBooking < 0) {
                state.listings.push(payload)
                state.count = state.listings.length
            }
        },
        increaseQuantity: (state, action) => {
            const { listingId, variantId, bookingDate } = action.payload
            const existingBooking = state.listings.findIndex(
                (listing) => listing.listingId === listingId &&
                    listing.variantId === variantId &&
                    JSON.stringify([...(listing.bookingDate || [])].sort()) === JSON.stringify([...(bookingDate || [])].sort())
            )
            if (existingBooking >= 0) {
                state.listings[existingBooking].quantity += 10
            }
        },
        decreaseQuantity: (state, action) => {
            const { listingId, variantId, bookingDate } = action.payload
            const existingBooking = state.listings.findIndex(
                (listing) => listing.listingId === listingId &&
                    listing.variantId === variantId &&
                    JSON.stringify([...(listing.bookingDate || [])].sort()) === JSON.stringify([...(bookingDate || [])].sort())
            )
            if (existingBooking >= 0) {
                if (state.listings[existingBooking].quantity > 1) {
                    state.listings[existingBooking].quantity -= 10
                }
            }
        },
        removeFromBooking: (state, action) => {
            const { listingId, variantId, bookingDate } = action.payload
            state.listings = state.listings.filter((listing) => {
                const isMatch = listing.listingId === listingId &&
                    listing.variantId === variantId &&
                    JSON.stringify([...(listing.bookingDate || [])].sort()) === JSON.stringify([...(bookingDate || [])].sort());
                return !isMatch;
            });

            state.count = state.listings.length
        },


        clearBooking: (state, action) => {
            state.listings = []
            state.count = 0
        },

        syncVerifiedBookings: (state, action) => {
            const verifiedData = action.payload; // This is the array from server

            state.listings = state.listings.map((localItem, index) => {
                // Prefer index-based match (1:1 correspondence) when lengths match
                let verifiedItem = verifiedData[index];
                const matchByFields = (v) =>
                    String(v?.listingId) === String(localItem?.listingId) &&
                    String(v?.variantId || '') === String(localItem?.variantId || '') &&
                    JSON.stringify([...(v?.bookingDate || [])].sort()) === JSON.stringify([...(localItem?.bookingDate || [])].sort());

                if (!verifiedItem || !matchByFields(verifiedItem)) {
                    verifiedItem = verifiedData.find(matchByFields);
                }

                if (verifiedItem) {
                    const merged = {
                        ...localItem,
                        ...verifiedItem,
                        bookingDate: localItem.bookingDate,
                        quantity: localItem.quantity,
                        status: localItem.status || 'pending',
                        thumbnail: (typeof verifiedItem.thumbnail === 'object' && verifiedItem.thumbnail !== null)
                            ? verifiedItem.thumbnail
                            : localItem.thumbnail,
                        // Preserve local discount/price when server didn't find calendar entries
                        discount: typeof verifiedItem.discount === 'number' ? verifiedItem.discount : localItem.discount,
                        price: (typeof verifiedItem.discount === 'number' && verifiedItem.discount > 0)
                            ? verifiedItem.price
                            : (localItem.discount > 0 ? localItem.price : verifiedItem.price),
                        calendarPrice: typeof verifiedItem.calendarPrice === 'number' ? verifiedItem.calendarPrice : localItem.calendarPrice,
                    };
                    return merged;
                }
                return localItem;
            });

            state.count = state.listings.length;
        }
    }
})

export const {
    addIntoBooking,
    increaseQuantity,
    decreaseQuantity,
    removeFromBooking,
    clearBooking,
    syncVerifiedBookings
} = bookingReducer.actions
export default bookingReducer.reducer