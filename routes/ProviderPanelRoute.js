export const PROVIDER_DASHBOARD = '/provider/dashboard'
export const PROVIDER_PROFILE = '/provider/profile'
export const PROVIDER_BUSINESS_PROFILE = '/provider/business-profile'
// export const PROVIDER_MEDIA_EDIT = (id) => id ? `/provider/media/edit/${id}` : ''
export const PROVIDER_MEDIA_SHOW = '/provider/media'
export const PROVIDER_EXPENSES = '/provider/expenses'


// listing routes
export const PROVIDER_LISTING_SHOW = '/provider/listing'
export const PROVIDER_LISTING_ADD = '/provider/listing/add'
export const PROVIDER_LISTING_EDIT = (id) => id ? `/provider/listing/edit/${id}` : ''

// listing routes
export const PROVIDER_LISTING_VARIANT_SHOW = '/provider/listing-variant'
export const PROVIDER_LISTING_VARIANT_ADD = '/provider/listing-variant/add'
export const PROVIDER_LISTING_VARIANT_EDIT = (id) => id ? `/provider/listing-variant/edit/${id}` : ''

// listing routes
export const PROVIDER_PRODUCT_SHOW = '/provider/product'
export const PROVIDER_PRODUCT_ADD = '/provider/product/add'
export const PROVIDER_PRODUCT_EDIT = (id) => id ? `/provider/product/edit/${id}` : ''

// listing routes
export const PROVIDER_PRODUCT_VARIANT_SHOW = '/provider/product-variant'
export const PROVIDER_PRODUCT_VARIANT_ADD = '/provider/product-variant/add'
export const PROVIDER_PRODUCT_VARIANT_EDIT = (id) => id ? `/provider/product-variant/edit/${id}` : ''

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
export const PROVIDER_PRODUCT_ORDERS = '/provider/product-orders'
export const PROVIDER_PRODUCT_ORDER_DETAILS = (orderId) => orderId ? `/provider/product-orders/${orderId}` : ''
export const PROVIDER_PRODUCT_ORDERS_ACCEPTANCE = '/provider/product-orders?status=confirmed'
export const PROVIDER_PRODUCT_ORDERS_ACCEPTED = '/provider/product-orders?status=accepted'
export const PROVIDER_PRODUCT_ORDERS_PREPARING = '/provider/product-orders?status=preparing'
export const PROVIDER_PRODUCT_ORDERS_READY_TO_SHIP = '/provider/product-orders?status=ready_to_ship'
export const PROVIDER_PRODUCT_ORDERS_SHIPPED = '/provider/product-orders?status=shipped'
export const PROVIDER_PRODUCT_ORDERS_DELIVERED = '/provider/product-orders?status=fulfilled'
export const PROVIDER_PRODUCT_ORDERS_DECLINED = '/provider/product-orders?status=rejected'


export const PROVIDER_TRASH = '/provider/trash'

//staff
export const PROVIDER_STAFF_SHOW = '/provider/staff'
export const PROVIDER_STAFF_ADD = '/provider/staff/add'
export const PROVIDER_STAFF_EDIT = '/provider/staff/edit'

//support
export const PROVIDER_SUPPORT = '/provider/support'