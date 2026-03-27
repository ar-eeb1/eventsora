import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from '@mui/material'
import StatusBadge from "@/components/application/StatusBadge"
import React, { useState } from "react"
import { bookingStatus, paymentStatus } from "@/lib/utils"
import Select from "@/components/application/Main/Select"
import axios from "axios"
import { toast } from "sonner"
import userIcon from '@/public/assets/user.png'


const StatusEditCell = ({ value, row, type }) => {
    const [selectedStatus, setSelectedStatus] = useState(value)
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async (newStatus) => {
        setLoading(true)
        try {
            const res = await axios.put('/api/admin/bookings/status', {
                bookingId: row.original._id,
                status: newStatus,
                type: type
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setSelectedStatus(newStatus)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const options = (type === 'booking' ? bookingStatus : paymentStatus).map(s => ({
        label: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '),
        value: s
    }))

    return (
        <div className="w-40" onClick={(e) => e.stopPropagation()}>
            <Select
                options={options}
                selected={selectedStatus}
                setSelected={handleStatusChange}
                disabled={loading}
            />
        </div>
    )
}


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

export const DT_LISTING_VARIANT_COLUMN = [
    {
        accessorKey: 'listing',
        header: 'Listing Name'
    },
    {
        accessorKey: 'title',
        header: 'Title'
    },
    {
        accessorKey: 'serviceCode',
        header: 'Service Code'
    },
    {
        accessorKey: 'price',
        header: 'Starting Price'
    },
    {
        accessorKey: 'pricingType',
        header: 'Pricing Type'
    },
    {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ renderedCellValue }) => {
            if (renderedCellValue === 'approved') {
                return <Chip color='success' label='Approved' />
            }
            if (renderedCellValue === 'pending') {
                return <Chip color='warning' label='Pending' />
            }
            if (renderedCellValue === 'rejected') {
                return <Chip color='error' label='Rejected' />
            }

            return <Chip color='default' label={renderedCellValue} />
        }
    }

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

export const DT_BOOKING_COLUMN = [
    {
        accessorKey: 'booking_id',
        header: 'Booking'
    },
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'phone',
        header: 'Phone'
    },
    {
        accessorKey: 'eventType',
        header: 'Event Type'
    },
    {
        accessorKey: 'bookingDate',
        header: 'Booking Date',
        Cell: ({ row }) => {
            const dates = row.original?.listings?.[0]?.bookingDate
            return dates?.length ? dates[0] : '-'
        }
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount'
    },
    {
        accessorKey: 'bookingStatus',
        header: 'Status',
        Cell: ({ renderedCellValue }) => <StatusBadge status={renderedCellValue} type="booking" />
    },

]


export const DT_ADMIN_BOOKING_COLUMN = [
    {
        accessorKey: 'booking_id',
        header: 'Booking'
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
        accessorKey: 'paymentStatus',
        header: 'Payment Status',
        Cell: ({ renderedCellValue, row }) => <StatusEditCell value={renderedCellValue} row={row} type="payment" />
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount'
    },
    {
        accessorKey: 'bookingStatus',
        header: 'Status',
        Cell: ({ renderedCellValue }) => <StatusBadge status={renderedCellValue} type="booking" />
    },

]
