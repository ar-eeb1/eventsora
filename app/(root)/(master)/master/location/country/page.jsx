'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_COUNTRY_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { MASTER_COUNTRY_ADD, MASTER_COUNTRY_EDIT, MASTER_COUNTRY_SHOW, MASTER_DASHBOARD, MASTER_TRASH } from '@/routes/MasterPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_COUNTRY_SHOW, label: 'Countries' },
]

const ShowCountry = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_COUNTRY_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={MASTER_COUNTRY_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show Countries</h4>
                        <Button asChild>
                            <Link href={MASTER_COUNTRY_ADD}>
                                <FilePlus />
                                New Country
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className='px-0 '>
                    <DatatableWrapper
                        queryKey='Country-data'
                        fetchUrl='/api/master/location/country'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/master/location/country/export'
                        deleteEndpoint='/api/master/location/country/delete'
                        deleteType='SD'
                        trashView={`${MASTER_TRASH}?trashof=country`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowCountry
