import { ADMIN_LISTING_APPROVAL, ADMIN_LISTING_SHOW, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import { BriefcaseBusiness, Calendar, Image, LayoutDashboard, Logs, MessageCircleMore, Speech, Star, User, UserCog } from "lucide-react";

export const AdminSidebar = [
    {
        title: "Dashboard",
        url: '',
        icon: LayoutDashboard,
    },
    {
        title: "Users Management",
        url: '',
        icon: User,
        submenu: [
            {
                title: "All Users",
                url: '',
            },
            {
                title: "Verified Users",
                url: '',
            },
            {
                title: "Pending Verification",
                url: '',
            },
            {
                title: "Suspended Users",
                url: '',
            },
        ]
    },
    {
        title: "Providers Management",
        url: '',
        icon: UserCog,
        submenu: [
            {
                title: "All Providers",
                url: '',
            },
            {
                title: "Approve Providers",
                url: '',
            },
            {
                title: "Pending Providers",
                url: '',
            },
            {
                title: "Suspended Providers",
                url: '',
            },
        ]
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
                url: '',
            },
            {
                title: "Pending Bookings",
                url: '',
            },
            {
                title: "In-Progress Bookings",
                url: '',
            },
            {
                title: "Cancelled Bookings",
                url: '',
            },
            {
                title: "Completed Bookings",
                url: '',
            },
            {
                title: "Cancelled Bookings",
                url: '',
            },
        ]
    },
    {
        title: "Reviews & Ratings",
        url: '',
        icon: Star,
    },
    {
        title: "Media",
        url: ADMIN_MEDIA_SHOW,
        icon: Image,
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