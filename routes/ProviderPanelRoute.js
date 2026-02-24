export const PROVIDER_DASHBOARD = '/provider/dashboard'
export const PROVIDER_PROFILE = '/provider/profile'
export const PROVIDER_BUSINESS_PROFILE = '/provider/business-profile'
// export const PROVIDER_MEDIA_EDIT = (id) => id ? `/provider/media/edit/${id}` : ''
export const PROVIDER_MEDIA_SHOW = '/provider/media'


// listing routes
export const PROVIDER_LISTING_SHOW = '/provider/listing'
export const PROVIDER_LISTING_ADD = '/provider/listing/add'
export const PROVIDER_LISTING_EDIT = (id) => id ? `/provider/listing/edit/${id}` : ''

// listing routes
export const PROVIDER_LISTING_VARIANT_SHOW = '/provider/listing-variant'
export const PROVIDER_LISTING_VARIANT_ADD = '/provider/listing-variant/add'
export const PROVIDER_LISTING_VARIANT_EDIT = (id) => id ? `/provider/listing-variant/edit/${id}` : ''

// booking routes
export const PROVIDER_BOOKINGS_SHOW = '/provider/bookings'

// export const bookingStatus = ['', '', '', 'completed', 'cancelled', 'unverified']
export const PROVIDER_BOOKINGS_PENDING = '/provider/bookings?bookingStatus=pending'
export const PROVIDER_BOOKINGS_CONFIRMED = '/provider/bookings?bookingStatus=confirmed'
export const PROVIDER_BOOKINGS_AWAITING = '/provider/bookings?bookingStatus=awaiting-payment'
export const PROVIDER_BOOKINGS_COMPLETED = '/provider/bookings?bookingStatus=completed'
export const PROVIDER_BOOKINGS_CANCELLED = '/provider/bookings?bookingStatus=cancelled'
export const PROVIDER_BOOKINGS_UNVERIFIED = '/provider/bookings?bookingStatus=unverified'


export const PROVIDER_BOOKINGS_DETAILS = (booking_id) => booking_id ? `/provider/bookings/details/${booking_id}` : ''


//calendar
export const PROVIDER_LISTING_CALENDAR = '/provider/calendar'

//messages
export const PROVIDER_MESSAGES = '/provider/messages'


export const PROVIDER_TRASH = '/provider/trash'
