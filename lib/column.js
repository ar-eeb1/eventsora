import userIcon from '@/public/assets/user.png'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from '@mui/material'

export const DT_CATEOGORY_COLUMN = [
    {
        accessorKey: 'category',
        header: 'Category Name'
    },
    {
        accessorKey: 'slug',
        header: 'Slug'
    },
]

export const DT_SUB_CATEOGORY_COLUMN = [
    {
        accessorKey: 'category',
        header: 'Category'
    },
    {
        accessorKey: 'subcategory',
        header: 'Sub Category'
    },
    {
        accessorKey: 'slug',
        header: 'Slug'
    },
]

export const DT_COUNTRY_COLUMN = [
    {
        accessorKey: 'country',
        header: 'Country Name'
    },
    {
        accessorKey: 'code',
        header: 'Code'
    },
]

export const DT_STATE_COLUMN = [
    {
        accessorKey: 'state',
        header: 'State'
    },
    {
        accessorKey: 'country',
        header: 'Country Name'
    },
]

export const DT_CITY_COLUMN = [
    {
        accessorKey: 'city',
        header: 'City'
    },
    {
        accessorKey: 'state',
        header: 'State Name'
    },
]

export const DT_LOCALITY_COLUMN = [
    {
        accessorKey: 'locality',
        header: 'Locality'
    },
    {
        accessorKey: 'city',
        header: 'City Name'
    },
]

export const DT_SUBLOCALITY_COLUMN = [
    {
        accessorKey: 'sublocality',
        header: 'Sublocality'
    },
    {
        accessorKey: 'locality',
        header: 'Locality Name'
    },
]

export const DT_LISTING_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Listing Name'
    },
    {
        accessorKey: 'category',
        header: 'Category'
    },
    {
        accessorKey: 'subcategory',
        header: 'Subcategory'
    },
    {
        accessorKey: 'startingPrice',
        header: 'Starting Price'
    },
    {
        accessorKey: 'city',
        header: 'City'
    },
    {
        accessorKey: 'status',
        header: 'Status'
    },
]


export const DT_USERS_COLUMN = [
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        Cell: ({ renderedCellValue }) => (
            <Avatar>
                <AvatarImage src={renderedCellValue?.url || userIcon.src} />
            </Avatar>
        )
    },
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Phone'
    },
    {
        accessorKey: 'address',
        header: 'Address'
    },
    {
        accessorKey: 'role',
        header: 'Role'
    },
    {
        accessorKey: 'isEmailVerified',
        header: 'Verified',
        Cell: ({ renderedCellValue }) => (
            renderedCellValue ? <Chip color='success' label='Verified' /> : <Chip color='error' label='Not Verified' />
        )
    },
]

export const DT_REVIEW_COLUMN = [
    {
        accessorKey: 'listing',
        header: 'Listing'
    },
    {
        accessorKey: 'user',
        header: 'User'
    },
    {
        accessorKey: 'title',
        header: 'Title'
    },
    {
        accessorKey: 'rating',
        header: 'Rating'
    },
    {
        accessorKey: 'review',
        header: 'Review'
    },
]
