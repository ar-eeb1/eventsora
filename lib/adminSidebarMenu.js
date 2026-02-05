import { ADMIN_DASHBOARD, ADMIN_LISTING_APPROVAL, ADMIN_LISTING_SHOW, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import { BriefcaseBusiness, Calendar, Image, LayoutDashboard, Logs, MessageCircleMore, Speech, Star, User, UserCog } from "lucide-react";

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