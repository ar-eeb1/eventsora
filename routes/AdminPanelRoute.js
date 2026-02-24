export const WEBSITE_HOME = '/'
export const WEBSITE_LOGIN = '/auth/login'
export const WEBSITE_REGISTER = '/auth/register'
export const WEBSITE_RESETPASSWORD = '/auth/reset-password'

export const ADMIN_DASHBOARD = '/admin/dashboard'
export const ADMIN_MEDIA_SHOW = '/admin/media'

export const ADMIN_LISTING_SHOW = '/admin/listing'
export const ADMIN_LISTING_EDIT = (id) => id ? `/admin/listing/edit/${id}` : ''

export const ADMIN_TRASH = '/admin/trash'


// booking routes
export const ADMIN_BOOKINGS_SHOW = '/admin/bookings'
export const ADMIN_BOOKINGS_PENDING = '/admin/bookings?paymentStatus=pending'
export const ADMIN_BOOKINGS_PAID = '/admin/bookings?paymentStatus=paid'
export const ADMIN_BOOKINGS_PARTIAL = '/admin/bookings?paymentStatus=partially-paid'
export const ADMIN_BOOKINGS_CANCELLED = '/admin/bookings?paymentStatus=cancelled'
export const ADMIN_BOOKINGS_UNVERIFIED = '/admin/bookings?paymentStatus=unverified'
export const ADMIN_BOOKINGS_REFUNDED = '/admin/bookings?paymentStatus=refunded'


export const ADMIN_BOOKINGS_DETAILS = (booking_id) => booking_id ? `/admin/bookings/details/${booking_id}` : ''


