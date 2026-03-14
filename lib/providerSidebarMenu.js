import { PROVIDER_BOOKINGS_AWAITING, PROVIDER_BOOKINGS_CANCELLED, PROVIDER_BOOKINGS_COMPLETED, PROVIDER_BOOKINGS_CONFIRMED, PROVIDER_BOOKINGS_PENDING, PROVIDER_BOOKINGS_SHOW, PROVIDER_BOOKINGS_UNVERIFIED, PROVIDER_BUSINESS_PROFILE, PROVIDER_DASHBOARD, PROVIDER_LISTING_ADD, PROVIDER_LISTING_CALENDAR, PROVIDER_LISTING_SHOW, PROVIDER_LISTING_VARIANT_ADD, PROVIDER_LISTING_VARIANT_SHOW, PROVIDER_MEDIA_SHOW, PROVIDER_MESSAGES, PROVIDER_PROFILE, PROVIDER_STAFF_ADD, PROVIDER_STAFF_SHOW, PROVIDER_SUPPORT } from "@/routes/ProviderPanelRoute";
import { BriefcaseBusiness, Building2, Calendar, Calendar1Icon, Image, LayoutDashboard, MessageCircle, Star, UserRoundSearch, UsersRound } from "lucide-react";

export const ProviderSidebar = [
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
        title: "Services/Listing",
        url: '',
        icon: BriefcaseBusiness,
        submenu: [
            {
                title: "All Listings",
                url: PROVIDER_LISTING_SHOW,
            },
            {
                title: "All Variants",
                url: PROVIDER_LISTING_VARIANT_SHOW,
            },
            {
                title: "Add Listing",
                url: PROVIDER_LISTING_ADD,
            },
            {
                title: "Add Variant",
                url: PROVIDER_LISTING_VARIANT_ADD,
            },
        ]
    },
    {
        title: "Calendar",
        url: PROVIDER_LISTING_CALENDAR,
        icon: Calendar1Icon,
    },
    {
        title: "Bookings",
        url: '',
        icon: Calendar,
        submenu: [
            {
                title: "Bookings",
                url: PROVIDER_BOOKINGS_SHOW,
            },
            {
                title: "Pending Bookings",
                url: PROVIDER_BOOKINGS_PENDING,
            },
            {
                title: "Confirmed Bookings",
                url: PROVIDER_BOOKINGS_CONFIRMED,
            },
            {
                title: "Awaiting Payment Bookings",
                url: PROVIDER_BOOKINGS_AWAITING,
            },
            {
                title: "Completed Bookings",
                url: PROVIDER_BOOKINGS_COMPLETED,
            },
            {
                title: "Cancelled Bookings",
                url: PROVIDER_BOOKINGS_CANCELLED,
            },
            {
                title: "Unverified Bookings",
                url: PROVIDER_BOOKINGS_UNVERIFIED,
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
        url: PROVIDER_SUPPORT,
        icon: UserRoundSearch,
    },
    {
        title: "Staff Management",
        url: '',
        icon: UsersRound,
        submenu: [
            {
                title: "All Staff",
                url: PROVIDER_STAFF_SHOW,
            },
            {
                title: "Add Staff",
                url: PROVIDER_STAFF_ADD,
            },
        ]
    },
]