'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_SUBLOCALITY_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { MASTER_DASHBOARD, MASTER_SUBLOCALITY_ADD, MASTER_SUBLOCALITY_EDIT, MASTER_SUBLOCALITY_SHOW, MASTER_TRASH } from '@/routes/MasterPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SUBLOCALITY_SHOW, label: 'Localities' },
]

const ShowSublocality = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_SUBLOCALITY_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={MASTER_SUBLOCALITY_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show Sublocality</h4>
                        <Button asChild>
                            <Link href={MASTER_SUBLOCALITY_ADD}>
                                <FilePlus />
                                New Sublocality
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className='px-0 '>
                    <DatatableWrapper
                        queryKey='Sublocality-data'
                        fetchUrl='/api/master/location/sublocality'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/master/location/sublocality/export'
                        deleteEndpoint='/api/master/location/sublocality/delete'
                        deleteType='SD'
                        trashView={`${MASTER_TRASH}?trashof=sublocality`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowSublocality
