'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_USERS_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { MASTER_DASHBOARD, MASTER_TRASH, MASTER_USER_EDIT, MASTER_USER_SHOW } from '@/routes/MasterPanelRoute'
import React, { useCallback, useMemo } from 'react'

const breadcrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_USER_SHOW, label: 'All Users' }
]
const ShowUsers = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_USERS_COLUMN)
    })

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={MASTER_USER_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])
    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show Users</h4>
                    </div>
                </CardHeader>

                <CardContent className='px-0 '>
                    <DatatableWrapper
                        queryKey='users-data'
                        fetchUrl='/api/master/users'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/master/users/export'
                        deleteEndpoint='/api/master/users/delete'
                        deleteType='SD'
                        trashView={`${MASTER_TRASH}?trashof=users`}
                        createAction={action}
                    />
                </CardContent>
            </Card>

        </div>
    )
}

export default ShowUsers
