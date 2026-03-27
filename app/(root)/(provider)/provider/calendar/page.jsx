'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import ProviderCalendar from '@/components/application/ProviderCalendar'
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_CALENDAR } from '@/routes/ProviderPanelRoute'
import React from 'react'

const breadcrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Home' },
    { href: PROVIDER_LISTING_CALENDAR, label: 'Calendar' },
]

const ListingCalendar = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumbData} />
            <ProviderCalendar isPage={true} />
        </div>
    )
}

export default ListingCalendar