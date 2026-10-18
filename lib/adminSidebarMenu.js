import { ADMIN_BOOKINGS_CANCELLED, ADMIN_BOOKINGS_PAID, ADMIN_BOOKINGS_PARTIAL, ADMIN_BOOKINGS_PENDING, ADMIN_BOOKINGS_REFUNDED, ADMIN_BOOKINGS_SHOW, ADMIN_BOOKINGS_UNVERIFIED, ADMIN_DASHBOARD, ADMIN_LISTING_SHOW, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ORDERS, ADMIN_PRODUCT_ORDERS_ACCEPTED, ADMIN_PRODUCT_ORDERS_PENDING, ADMIN_PRODUCT_ORDERS_REJECTED, ADMIN_SEARCHES } from "@/routes/AdminPanelRoute";
import { BriefcaseBusiness, Calendar, Image, LayoutDashboard, MessageCircleMore, PackageCheck, Search, Speech } from "lucide-react";

export const AdminSidebar = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: "Listings / Services",
        url: '',
        icon: Calendar,
        submenu: [
            {
                title: "All Listings",
                url: ADMIN_LISTING_SHOW,
            },
        ]
    },
    {
        title: "Bookings ",
        url: '',
        icon: BriefcaseBusiness,
        submenu: [
            {
                title: "All Bookings",
                url: ADMIN_BOOKINGS_SHOW,
            },
            {
                title: "Pending Payment Bookings",
                url: ADMIN_BOOKINGS_PENDING,
            },
            {
                title: "Paid Payment Bookings",
                url: ADMIN_BOOKINGS_PAID,
            },
            {
                title: "Partial Payment Bookings",
                url: ADMIN_BOOKINGS_PARTIAL,
            },
            {
                title: "Cancelled Payment Bookings",
                url: ADMIN_BOOKINGS_CANCELLED,
            },
            {
                title: "Unverified Payment Bookings",
                url: ADMIN_BOOKINGS_UNVERIFIED,
            },
            {
                title: "Refunded Payment Bookings",
                url: ADMIN_BOOKINGS_REFUNDED,
            },

        ]
    },
    {
        title: "Shop Orders",
        url: '',
        icon: PackageCheck,
        submenu: [
            {
                title: "All Shop Orders",
                url: ADMIN_PRODUCT_ORDERS,
            },
            {
                title: "Pending Shop Orders",
                url: ADMIN_PRODUCT_ORDERS_PENDING,
            },
            {
                title: "Accepted Shop Orders",
                url: ADMIN_PRODUCT_ORDERS_ACCEPTED,
            },
            {
                title: "Rejected Shop Orders",
                url: ADMIN_PRODUCT_ORDERS_REJECTED,
            },
        ],
    },
    {
        title: "Search Analytics",
        url: ADMIN_SEARCHES,
        icon: Search,
    },
    {
        title: "Support",
        url: '',
        icon: MessageCircleMore,
        submenu: [
            {
                title: "Provider Help Requests",
                url: '',
            },
            {
                title: "Customer Help Requests",
                url: '',
            },

        ]
    },
    {
        title: "Reports",
        url: '',
        icon: Speech,
        submenu: [
            {
                title: "Provider Help Requests",
                url: '',
            },
            {
                title: "Customer Help Requests",
                url: '',
            },

        ]
    },
]