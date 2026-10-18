export const WEBSITE = '/'
export const SUSPENDED = '/suspended'

export const WEBSITE_LISTING = '/listing'
export const WEBSITE_CATEGORY = (slug) => slug ? `/${slug}` : ''
export const WEBSITE_LISTING_DETAILS = (slug) => slug ? `/listing/${slug}` : '/listing'
export const SHOP_CATEGORY = (slug) => slug ? `/shop/${encodeURIComponent(slug)}` : '/shop'
export const SHOP_PRODUCT_DETAILS = (categorySlug, productSlug) =>
	categorySlug && productSlug
		? `${SHOP_CATEGORY(categorySlug)}/${encodeURIComponent(productSlug)}`
		: SHOP

export const WEBSITE_MESSAGES = '/user/messages'
export const WEBSITE_BOOKINGS = '/booking'
export const WEBSITE_CHECKOUT = '/checkout'
export const WEBSITE_BOOKING_DETAILS = (booking_id) => `/booking-details/${booking_id}`


// user routes
export const USER_DASHBOARD = '/my-account'
export const USER_PROFILE = '/profile'
export const USER_BOOKINGS = '/my-bookings'
export const USER_ORDERS = '/my-orders'

export const TERMS_AND_CONDITIONS = '/terms-and-conditions'
export const PRIVACY_POLICY = '/privacy-policy'
export const REFUND_POLICY = '/refund-policy'
export const CANCELATION_POLICY = '/cancelation-policy'

export const SHOP= '/shop'
export const SHOP_CART = '/shop/cart'
export const SHOP_CHECKOUT = '/shop/checkout'
