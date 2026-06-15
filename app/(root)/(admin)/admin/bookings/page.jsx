'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import React, { useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import { columnConfig } from '@/lib/helperFunction'
import ViewAction from '@/components/application/Main/ViewAction'
import { ADMIN_BOOKINGS_DETAILS, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { DT_ADMIN_BOOKING_COLUMN } from '@/lib/column'

import { useSearchParams } from 'next/navigation'

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Dashboard' },
    { href: '', label: 'Bookings' },
]

const ShowBookings = () => {
    const searchParams = useSearchParams()
    const paymentStatus = searchParams.get('paymentStatus')

    const columns = useMemo(() => {
        return columnConfig(DT_ADMIN_BOOKING_COLUMN)
    }, [])

    const action = useCallback((row) => {
        let actionMenu = []
        actionMenu.push(<ViewAction key='view' href={ADMIN_BOOKINGS_DETAILS(row.original.booking_id)} />)
        return actionMenu
    }, [])

    const fetchUrl = useMemo(() => {
        return paymentStatus ? `/api/admin/bookings?paymentStatus=${paymentStatus}` : '/api/admin/bookings'
    }, [paymentStatus])

    const title = useMemo(() => {
        return paymentStatus ? `${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)} Bookings` : 'All Bookings'
    }, [paymentStatus])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0 '>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>{title}</h4>
                    </div>
                </CardHeader>
                <CardContent className='px-0 '>
                    <DatatableWrapper

                        queryKey={`bookings-data-${paymentStatus || 'all'}`}
                        fetchUrl={fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/admin/bookings/export'
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowBookings
