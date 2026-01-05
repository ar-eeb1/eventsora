import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { MASTER_CATEGORY_ADD, MASTER_CATEGORY_SHOW, MASTER_CITY_ADD, MASTER_CITY_SHOW, MASTER_COUNTRY_ADD, MASTER_COUNTRY_SHOW, MASTER_DASHBOARD, MASTER_LOCALITY_ADD, MASTER_LOCALITY_SHOW, MASTER_REVIEW_SHOW, MASTER_STATE_ADD, MASTER_STATE_SHOW, MASTER_SUB_CATEGORY_ADD, MASTER_SUB_CATEGORY_SHOW, MASTER_SUBLOCALITY_ADD, MASTER_SUBLOCALITY_SHOW, MASTER_USER_SHOW } from "@/routes/MasterPanelRoute";
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_ADD, PROVIDER_LISTING_SHOW, PROVIDER_MEDIA_SHOW } from "@/routes/ProviderPanelRoute";


export const searchProviderData = [
    {
        label: "Dashboard",
        description: "View website analytics and reports",
        url: PROVIDER_DASHBOARD,
        keywords: ["dashboard", "overview", "analytics", "insights"]
    },
    {
        label: "Listing",
        description: "Manage listings",
        url: PROVIDER_LISTING_SHOW,
        keywords: ["listing", "product listing"]
    },
    {
        label: "Add Listing",
        description: "Add new listings",
        url: PROVIDER_LISTING_ADD,
        keywords: ["add listing", "new listing"]
    },
    //    {
    //        label: "Product Variant",
    //        description: "Manage all product variants",
    //        url: PROVIDER_PRODUCT_VARIANT_SHOW,
    //        keywords: ["products variants", "variants"]
    //    },
    //    {
    //        label: "Coupon",
    //        description: "Manage active discount coupons",
    //        url: PROVIDER_COUPON_SHOW,
    //        keywords: ["discount", "promo", "coupon"]
    //    },
    //    {
    //        label: "Add Coupon",
    //        description: "Create a new discount coupon",
    //        url: PROVIDER_COUPON_ADD,
    //        keywords: ["add coupon", "new coupon", "promotion", "offers"]
    //    },
    //    {
    //        label: "Orders",
    //        description: "Manage customer orders",
    //        url: 'PROVIDER_ORDER_SHOW',
    //        keywords: ["orders"]
    //    },
    //    {
    //        label: "Customers",
    //        description: "View and manage customer information",
    //        url: PROVIDER_CUSTOMERS_SHOW,
    //        keywords: ["customers", "users"]
    //    },
    //    {
    //        label: "Review",
    //        description: "Manage customer reviews and feedback",
    //        url: PROVIDER_REVIEW_SHOW,
    //        keywords: ["ratings", "feedback"]
    //    },
    {
        label: "Media",
        description: "Manage website media files",
        url: PROVIDER_MEDIA_SHOW,
        keywords: ["images", "videos"]
    },

];

// export default searchProviderData



export const searchMasterData = [
    {
        label: "Dashboard",
        description: "View website analytics and reports",
        url: MASTER_DASHBOARD,
        keywords: ["dashboard", "overview", "analytics", "insights"]
    },
    {
        label: "Category",
        description: "Manage product categories",
        url: MASTER_CATEGORY_SHOW,
        keywords: ["category", "product category"]
    },
    {
        label: "Add Category",
        description: "Add new product categories",
        url: MASTER_CATEGORY_ADD,
        keywords: ["add category", "new category"]
    },
    {
        label: "Subcategory",
        description: "Manage product categories",
        url: MASTER_SUB_CATEGORY_SHOW,
        keywords: ["subcategory", "product subcategory"]
    },
    {
        label: "Add Subcategory",
        description: "Add new product categories",
        url: MASTER_SUB_CATEGORY_ADD,
        keywords: ["add subcategory", "new subcategory"]
    },
    {
        label: "Subcategory",
        description: "Manage product categories",
        url: MASTER_SUB_CATEGORY_SHOW,
        keywords: ["subcategory", "product subcategory"]
    },
    {
        label: "Add Subcategory",
        description: "Add new product subcategories",
        url: MASTER_SUB_CATEGORY_ADD,
        keywords: ["add subcategory", "new subcategory"]
    },
    {
        label: "Country",
        description: "Manage Country",
        url: MASTER_COUNTRY_SHOW,
        keywords: ["country", "country"]
    },
    {
        label: "Add Country",
        description: "Add new country",
        url: MASTER_COUNTRY_ADD,
        keywords: ["add country", "new country"]
    },
    {
        label: "State",
        description: "Manage State",
        url: MASTER_STATE_SHOW,
        keywords: ["state", "state"]
    },
    {
        label: "Add State",
        description: "Add new state",
        url: MASTER_STATE_ADD,
        keywords: ["add state", "new state"]
    },
    {
        label: "City",
        description: "Manage City",
        url: MASTER_CITY_SHOW,
        keywords: ["city", "city"]
    },
    {
        label: "Add City",
        description: "Add new city",
        url: MASTER_CITY_ADD,
        keywords: ["add city", "new city"]
    },
    {
        label: "Locality",
        description: "Manage Locality",
        url: MASTER_LOCALITY_SHOW,
        keywords: ["locality", "locality"]
    },
    {
        label: "Add Locality",
        description: "Add new locality",
        url: MASTER_LOCALITY_ADD,
        keywords: ["add locality", "new locality"]
    },
    {
        label: "Sublocality",
        description: "Manage Sublocality",
        url: MASTER_SUBLOCALITY_SHOW,
        keywords: ["sublocality", "sublocality"]
    },
    {
        label: "Add Sublocality",
        description: "Add new sublocality",
        url: MASTER_SUBLOCALITY_ADD,
        keywords: ["add sublocality", "new sublocality"]
    },
    // {
    //     label: "Orders",
    //     description: "Manage customer orders",
    //     url: MASTER_ORDER_SHOW,
    //     keywords: ["orders"]
    // },
    {
        label: "User",
        description: "View and manage user information",
        url: MASTER_USER_SHOW,
        keywords: ["user", "users"]
    },
    {
        label: "Review",
        description: "Manage user reviews and feedback",
        url: MASTER_REVIEW_SHOW,
        keywords: ["ratings", "feedback"]
    },
];

export default searchMasterData;




export const searchAdminData = [
    {
        label: "Dashboard",
        description: "View website analytics and reports",
        url: ADMIN_DASHBOARD,
        keywords: ["dashboard", "overview", "analytics", "insights"]
    },
    {
        label: "Booking",
        description: "Manage Bookings",
        url: '',
        keywords: ["booking", "product booking"]
    },
    // {
    //     label: "Orders",
    //     description: "Manage customer orders",
    //     url: MASTER_ORDER_SHOW,
    //     keywords: ["orders"]
    // },
    {
        label: "User",
        description: "View and manage user information",
        url: MASTER_USER_SHOW,
        keywords: ["user", "users"]
    },
    {
        label: "Review",
        description: "Manage user reviews and feedback",
        url: MASTER_REVIEW_SHOW,
        keywords: ["ratings", "feedback"]
    },
];



