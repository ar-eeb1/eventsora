'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_BOOKING_COLUMN, DT_LISTING_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { PROVIDER_DASHBOARD, PROVIDER_TRASH } from '@/routes/ProviderPanelRoute'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_TRASH, label: 'Trash' },
]

const TRASH_CONFIG = {
  listing: {
    title: 'Listing Trash',
    columns: DT_LISTING_COLUMN,
    fetchUrl: '/api/provider/listing',
    exportUrl: '/api/provider/listing/export',
    deleteUrl: '/api/provider/listing/delete'
  },
  bookings: {
    title: 'Booking Trash',
    columns: DT_BOOKING_COLUMN,
    fetchUrl: '/api/provider/bookings',
    exportUrl: '/api/provider/bookings/export',
    deleteUrl: '/api/provider/bookings/delete'
  },
}

const Trash = () => {

  const searchParams = useSearchParams()
  const trashOf = searchParams.get('trashof')

  const config = TRASH_CONFIG[trashOf]

  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />]
  }, [])

  return (
    <div className=''>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className='flex items-center justify-between'>
            <h4 className='text-xl font-semibold'>{config.title}</h4>
          </div>
        </CardHeader>

        <CardContent className='px-0 '>
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType='PD'
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Trash
