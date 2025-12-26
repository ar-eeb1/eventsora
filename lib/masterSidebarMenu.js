
import { MASTER_CATEGORY_ADD, MASTER_CATEGORY_SHOW, MASTER_CITY_ADD, MASTER_CITY_SHOW, MASTER_COUNTRY_ADD, MASTER_COUNTRY_SHOW, MASTER_DASHBOARD, MASTER_LOCALITY_ADD, MASTER_LOCALITY_SHOW, MASTER_REVIEW_SHOW, MASTER_STATE_ADD, MASTER_STATE_SHOW, MASTER_SUB_CATEGORY_ADD, MASTER_SUB_CATEGORY_SHOW, MASTER_SUBLOCALITY_ADD, MASTER_SUBLOCALITY_SHOW, MASTER_USER_SHOW } from "@/routes/MasterPanelRoute";
import { LocationOn, ReviewsOutlined} from "@mui/icons-material";
import { LayoutDashboard, Logs, Star, User2Icon } from "lucide-react";

export const MasterSidebar = [
    {
        title: "Dashboard",
        url: MASTER_DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: "Location",
        url: '',
        icon: LocationOn,
        submenu: [
            {
                title: "Countries",
                url: MASTER_COUNTRY_SHOW,
            },
            {
                title: "Add Country",
                url: MASTER_COUNTRY_ADD,
            },
            {
                title: "States",
                url: MASTER_STATE_SHOW,
            },
            {
                title: "Add State",
                url: MASTER_STATE_ADD,
            },
            {
                title: "Cities",
                url: MASTER_CITY_SHOW,
            },
            {
                title: "Add City",
                url: MASTER_CITY_ADD,
            },
            {
                title: "Localities",
                url: MASTER_LOCALITY_SHOW,
            },
            {
                title: "Add Locality",
                url: MASTER_LOCALITY_ADD,
            },
            {
                title: "Sublocalities",
                url: MASTER_SUBLOCALITY_SHOW,
            },
            {
                title: "Add SubLocality",
                url: MASTER_SUBLOCALITY_ADD,
            },


        ]
    },
    {
        title: "Categories",
        url: '',
        icon: Logs,
        submenu: [
            {
                title: "All Category",
                url: MASTER_CATEGORY_SHOW,
            },
            {
                title: "Add Categories",
                url: MASTER_CATEGORY_ADD,
            },
            {
                title: "All Sub Category",
                url: MASTER_SUB_CATEGORY_SHOW,
            },
            {
                title: "Add Sub Category",
                url: MASTER_SUB_CATEGORY_ADD,
            },

        ]
    },
    {
        title: "Rating & Reviews",
        url: MASTER_REVIEW_SHOW,
        icon: Star,
    },
    {
        title: 'Users',
        url: MASTER_USER_SHOW,
        icon: User2Icon
    }
]