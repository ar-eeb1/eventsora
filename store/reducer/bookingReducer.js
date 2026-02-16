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

            state.listings = state.listings.map(localItem => {
                // Find matching item from server
                const verifiedItem = verifiedData.find(v =>
                    v.listingId === localItem.listingId &&
                    v.variantId === localItem.variantId
                );

                if (verifiedItem) {
                    // Update server-side fields but KEEP local-side fields (like bookingDate, quantity)
                    return {
                        ...localItem, // Keep everything local (bookingDate, quantity, etc.)
                        ...verifiedItem, // Override with server data (price, slug, name, etc.)
                        // Ensure we don't accidentally overwrite local fields if server returns them as null or different shape
                        bookingDate: localItem.bookingDate,
                        quantity: localItem.quantity,
                        status: localItem.status || 'pending',
                        // If verified thumbnail is just a string (ID) but local is an object, keep local
                        thumbnail: (typeof verifiedItem.thumbnail === 'object' && verifiedItem.thumbnail !== null)
                            ? verifiedItem.thumbnail
                            : localItem.thumbnail
                    };
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