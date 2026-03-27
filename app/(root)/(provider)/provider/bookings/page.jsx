'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import React, { useCallback, useMemo } from 'react'
import { PROVIDER_BOOKINGS_DETAILS, PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'
import { DT_BOOKING_COLUMN } from '@/lib/column'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import { columnConfig } from '@/lib/helperFunction'
import ViewAction from '@/components/application/Main/ViewAction'
import { useSearchParams } from 'next/navigation'
import ManualBookingModal from './ManualBookingModal'
import ReceivePaymentAction from './ReceivePaymentAction'

const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: '', label: 'Bookings' },
]

const ShowBookings = () => {
    const searchParams = useSearchParams()
    const bookingStatus = searchParams.get('bookingStatus')

    const fetchUrl = useMemo(() => {
        return bookingStatus ? `/api/provider/bookings?bookingStatus=${bookingStatus}` : '/api/provider/bookings'
    }, [bookingStatus])


    const columns = useMemo(() => {
        return columnConfig(DT_BOOKING_COLUMN)
    }, [])

    const action = useCallback((row) => {
        let actionMenu = []
        actionMenu.push(<ViewAction key='view' href={PROVIDER_BOOKINGS_DETAILS(row.original.booking_id)} />)
        actionMenu.push(<ReceivePaymentAction key='payment' booking={row.original} />)
        return actionMenu
    }, [])

    const title = useMemo(() => {
        return bookingStatus ? `${bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1).replace(/-/g, ' ')} Bookings` : 'All Bookings'
    }, [bookingStatus])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0 '>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>{title}</h4>
                        <ManualBookingModal />
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DatatableWrapper
                        queryKey={`bookings-data-${bookingStatus || 'all'}`}
                        fetchUrl={fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/provider/bookings/export'
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowBookings
