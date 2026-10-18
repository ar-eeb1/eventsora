import { PROVIDER_BUSINESS_PROFILE, PROVIDER_DASHBOARD, PROVIDER_MESSAGES, PROVIDER_PRODUCT_ADD, PROVIDER_PRODUCT_ORDERS, PROVIDER_PRODUCT_ORDERS_ACCEPTANCE, PROVIDER_PRODUCT_ORDERS_ACCEPTED, PROVIDER_PRODUCT_ORDERS_DECLINED, PROVIDER_PRODUCT_ORDERS_DELIVERED, PROVIDER_PRODUCT_ORDERS_PREPARING, PROVIDER_PRODUCT_ORDERS_READY_TO_SHIP, PROVIDER_PRODUCT_ORDERS_SHIPPED, PROVIDER_PRODUCT_SHOW, PROVIDER_PRODUCT_VARIANT_ADD, PROVIDER_PRODUCT_VARIANT_SHOW, PROVIDER_PROFILE } from "@/routes/ProviderPanelRoute";
import { BriefcaseBusiness, Building2, Calendar, Calendar1Icon, IdCardLanyard, Image, LayoutDashboard, MessageCircle, Star, UserRoundSearch, UsersRound } from "lucide-react";

export const SellerSidebar = [
    {
        title: "Dashboard",
        url: PROVIDER_DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: "My Profile",
        url: '',
        icon: Building2,
        submenu: [
            {
                title: "Profile",
                url: PROVIDER_PROFILE,
            },
            {
                title: "Business Profile",
                url: PROVIDER_BUSINESS_PROFILE,
            },
        ]
    },
    {
        title: "Messages",
        url: PROVIDER_MESSAGES,
        icon: MessageCircle,
    },
    {
        title: "Products",
        url: '',
        icon: BriefcaseBusiness,
        submenu: [
            {
                title: "All Products",
                url: PROVIDER_PRODUCT_SHOW,
            },
            {
                title: "Add New Product",
                url: PROVIDER_PRODUCT_ADD,
            },
            {
                title: "All Product Variants",
                url: PROVIDER_PRODUCT_VARIANT_SHOW,
            },
            {
                title: "Add New Product Variants",
                url: PROVIDER_PRODUCT_VARIANT_ADD,
            },
        ]
    },

    {
        title: "Orders",
        url: '',
        icon: Calendar,
        submenu: [
            { title: "All Orders", url: PROVIDER_PRODUCT_ORDERS },
            { title: "Awaiting Acceptance", url: PROVIDER_PRODUCT_ORDERS_ACCEPTANCE },
            { title: "Accepted", url: PROVIDER_PRODUCT_ORDERS_ACCEPTED },
            { title: "Preparing", url: PROVIDER_PRODUCT_ORDERS_PREPARING },
            { title: "Ready to Ship", url: PROVIDER_PRODUCT_ORDERS_READY_TO_SHIP },
            { title: "Shipped", url: PROVIDER_PRODUCT_ORDERS_SHIPPED },
            { title: "Delivered", url: PROVIDER_PRODUCT_ORDERS_DELIVERED },
            { title: "Declined", url: PROVIDER_PRODUCT_ORDERS_DECLINED },
        ],
    },


]