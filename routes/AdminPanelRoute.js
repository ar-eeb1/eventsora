export const WEBSITE_HOME = '/'
export const WEBSITE_LOGIN = '/auth/login'
export const WEBSITE_REGISTER = '/auth/register'
export const WEBSITE_RESETPASSWORD = '/auth/reset-password'

export const ADMIN_DASHBOARD = '/admin/dashboard'
export const ADMIN_MEDIA_SHOW = '/admin/media'

export const ADMIN_LISTING_SHOW = '/admin/listing'
export const ADMIN_LISTING_EDIT = (id) => id ? `/admin/listing/edit/${id}` : ''

export const ADMIN_TRASH = '/admin/trash'