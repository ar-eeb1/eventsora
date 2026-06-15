
export const MASTER_DASHBOARD = '/master/dashboard'

// category routes
export const MASTER_CATEGORY_SHOW = '/master/category'
export const MASTER_CATEGORY_ADD = '/master/category/add'
export const MASTER_CATEGORY_EDIT = (id) => id ? `/master/category/edit/${id}` : ''

//sub category
export const MASTER_SUB_CATEGORY_SHOW = '/master/subcategory'
export const MASTER_SUB_CATEGORY_ADD = '/master/subcategory/add'
export const MASTER_SUB_CATEGORY_EDIT = (id) => id ? `/master/subcategory/edit/${id}` : ''

export const MASTER_TRASH = '/master/trash'

//country routes
export const MASTER_COUNTRY_SHOW = '/master/location/country'
export const MASTER_COUNTRY_ADD = '/master/location/country/add'
export const MASTER_COUNTRY_EDIT = (id) => id ? `/master/location/country/edit/${id}` : ''

//states routes
export const MASTER_STATE_SHOW = '/master/location/state'
export const MASTER_STATE_ADD = '/master/location/state/add'
export const MASTER_STATE_EDIT = (id) => id ? `/master/location/state/edit/${id}` : ''

//city routes
export const MASTER_CITY_SHOW = '/master/location/city'
export const MASTER_CITY_ADD = '/master/location/city/add'
export const MASTER_CITY_EDIT = (id) => id ? `/master/location/city/edit/${id}` : ''

//locality routes
export const MASTER_LOCALITY_SHOW = '/master/location/locality'
export const MASTER_LOCALITY_ADD = '/master/location/locality/add'
export const MASTER_LOCALITY_EDIT = (id) => id ? `/master/location/locality/edit/${id}` : ''

//sublocality routes
export const MASTER_SUBLOCALITY_SHOW = '/master/location/sublocality'
export const MASTER_SUBLOCALITY_ADD = '/master/location/sublocality/add'
export const MASTER_SUBLOCALITY_EDIT = (id) => id ? `/master/location/sublocality/edit/${id}` : ''

//USER SHOW routes
export const MASTER_USER_SHOW = '/master/users'
export const MASTER_USER_EDIT = (id) => id ? `/master/users/edit/${id}` : ''


//Reviews show routes
export const MASTER_REVIEW_SHOW = '/master/review'

