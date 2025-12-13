'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {  DT_SUB_CATEOGORY_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { MASTER_DASHBOARD, MASTER_SUB_CATEGORY_ADD, MASTER_SUB_CATEGORY_EDIT, MASTER_SUB_CATEGORY_SHOW, MASTER_TRASH } from '@/routes/MasterPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SUB_CATEGORY_SHOW, label: 'Sub Categories' },
]

const ShowSubCategory = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_SUB_CATEOGORY_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={MASTER_SUB_CATEGORY_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show Category</h4>
                        <Button asChild>
                            <Link href={MASTER_SUB_CATEGORY_ADD}>
                                <FilePlus />
                                New Category
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className='px-0 '>
                    <DatatableWrapper
                        queryKey='Category-data'
                        fetchUrl='/api/master/sub-category'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/master/sub-category/export'
                        deleteEndpoint='/api/master/sub-category/delete'
                        deleteType='SD'
                        trashView={`${MASTER_TRASH}?trashof=subCategory`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowSubCategory
