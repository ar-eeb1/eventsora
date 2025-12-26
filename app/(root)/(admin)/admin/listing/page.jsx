'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_LISTING_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_LISTING_EDIT, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import { PROVIDER_DASHBOARD, PROVIDER_LISTING_ADD, PROVIDER_LISTING_EDIT, PROVIDER_LISTING_SHOW, PROVIDER_TRASH } from '@/routes/ProviderPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: PROVIDER_LISTING_SHOW, label: 'Listings' },
]

const ShowListing = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_LISTING_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={ADMIN_LISTING_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show All Listings</h4>
                    </div>
                </CardHeader>

                <CardContent className='px-0 '>
                    <DatatableWrapper
                        queryKey='Listing-data'
                        fetchUrl='/api/admin/listing'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/admin/listing/export'
                        deleteEndpoint='/api/admin/listing/delete'
                        deleteType='SD'
                        trashView={`${ADMIN_TRASH}?trashof=listing`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowListing
