import { PROVIDER_DASHBOARD, PROVIDER_LISTING_ADD, PROVIDER_LISTING_SHOW, PROVIDER_MEDIA_SHOW } from "@/routes/ProviderPanelRoute";
import { BriefcaseBusiness, Building2, Calendar, Image, LayoutDashboard, MessageCircle, Star, UserRoundSearch, UsersRound } from "lucide-react";

export const ProviderSidebar = [
    {
        title: "Dashboard",
        url: PROVIDER_DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: "Business Profile",
        url: '',
        icon: Building2,
    },
    {
        title: "Messages",
        url: '',
        icon: MessageCircle,
    },
    {
        title: "Services",
        url: '',
        icon: BriefcaseBusiness,
        submenu: [
            {
                title: "All Listings",
                url: PROVIDER_LISTING_SHOW,
            },
            {
                title: "Add New",
                url: PROVIDER_LISTING_ADD,
            },
            {
                title: "Manage Lisitngs",
                url: '',
            },
        ]
    },
    {
        title: "Bookings",
        url: '',
        icon: Calendar,
        submenu: [
            {
                title: "Today Bookings",
                url: '',
            },
            {
                title: "Booking Requests",
                url: '',
            },
            {
                title: "Confirmed Booking",
                url: '',
            },
        ]
    },
    {
        title: "Media",
        url: PROVIDER_MEDIA_SHOW,
        icon: Image,
    },
    {
        title: "Support",
        url: '',
        icon: UserRoundSearch,
    },
    {
        title: "Reviews",
        url: '',
        icon: Star,
    },
    {
        title: "Staff Management",
        url: '',
        icon: UsersRound,
    },
]