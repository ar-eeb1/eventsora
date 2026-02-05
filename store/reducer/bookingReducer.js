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
                state.listings[existingBooking].qty += 1
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
                if (state.listings[existingBooking].qty > 1) {
                    state.listings[existingBooking].qty -= 1
                }
            }
        },
        removeFromBooking: (state, action) => {
            const { listingId, variantId, bookingDate } = action.payload
            state.listings = state.listings.filter((listing) => !(
                listing.listingId === listingId &&
                listing.variantId === variantId &&
                JSON.stringify([...(listing.bookingDate || [])].sort()) === JSON.stringify([...(bookingDate || [])].sort())
            ))

            state.count = state.listings.length
        },
        clearBooking: (state, action) => {
            state.listings = []
            state.count = 0
        }
    }
})

export const {
    addIntoBooking,
    increaseQuantity,
    decreaseQuantity,
    removeFromBooking,
    clearBooking
} = bookingReducer.actions
export default bookingReducer.reducer