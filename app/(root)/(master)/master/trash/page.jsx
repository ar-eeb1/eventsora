'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_CATEOGORY_COLUMN, DT_CITY_COLUMN, DT_COUNTRY_COLUMN, DT_LOCALITY_COLUMN, DT_STATE_COLUMN, DT_SUB_CATEOGORY_COLUMN, DT_SUBLOCALITY_COLUMN, DT_USERS_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import {  MASTER_DASHBOARD, MASTER_TRASH } from '@/routes/MasterPanelRoute'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
  { href: MASTER_DASHBOARD, label: 'Dashboard' },
  { href: MASTER_TRASH, label: 'Category Trash' },
]

const TRASH_CONFIG = {
  category: {
    title: 'Category Trash',
    columns: DT_CATEOGORY_COLUMN,
    fetchUrl: '/api/master/category',
    exportUrl: '/api/master/category/export',
    deleteUrl: '/api/master/category/delete'
  },
  subcategory: {
    title: 'Sub Category Trash',
    columns: DT_SUB_CATEOGORY_COLUMN,
    fetchUrl: '/api/master/subcategory',
    exportUrl: '/api/master/subcategory/export',
    deleteUrl: '/api/master/subcategory/delete'
  },
  country: {
    title: 'Country Trash',
    columns: DT_COUNTRY_COLUMN,
    fetchUrl: '/api/master/location/country',
    exportUrl: '/api/master/location/country/export',
    deleteUrl: '/api/master/location/country/delete'
  },
  state: {
    title: 'State Trash',
    columns: DT_STATE_COLUMN,
    fetchUrl: '/api/master/location/state',
    exportUrl: '/api/master/location/state/export',
    deleteUrl: '/api/master/location/state/delete'
  },
  city: {
    title: 'City Trash',
    columns: DT_CITY_COLUMN,
    fetchUrl: '/api/master/location/city',
    exportUrl: '/api/master/location/city/export',
    deleteUrl: '/api/master/location/city/delete'
  },
  locality: {
    title: 'Locality Trash',
    columns: DT_LOCALITY_COLUMN,
    fetchUrl: '/api/master/location/locality',
    exportUrl: '/api/master/location/locality/export',
    deleteUrl: '/api/master/location/locality/delete'
  },
  sublocality: {
    title: 'Sublocality Trash',
    columns: DT_SUBLOCALITY_COLUMN,
    fetchUrl: '/api/master/location/sublocality',
    exportUrl: '/api/master/location/sublocality/export',
    deleteUrl: '/api/master/location/sublocality/delete'
  },
  users: {
    title: 'Users Trash',
    columns: DT_USERS_COLUMN,
    fetchUrl: '/api/master/users',
    exportUrl: '/api/master/users/export',
    deleteUrl: '/api/master/users/delete'
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
