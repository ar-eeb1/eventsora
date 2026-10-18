'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_SHOP_SUB_CATEOGORY_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { MASTER_DASHBOARD, MASTER_SHOP_SUB_CATEGORY_ADD, MASTER_SHOP_SUB_CATEGORY_EDIT, MASTER_TRASH } from '@/routes/MasterPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: MASTER_DASHBOARD, label: 'Dashboard' },
    { href: MASTER_SHOP_SUB_CATEGORY_ADD, label: 'Shop Sub Categories' },
]

const ShowShopSubcategory = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_SHOP_SUB_CATEOGORY_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={MASTER_SHOP_SUB_CATEGORY_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className=''>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold'>Show Shop Subcategory</h4>
                        <Button asChild>
                            <Link href={MASTER_SHOP_SUB_CATEGORY_ADD}>
                                <FilePlus />
                                New Shop Subcategory
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className='px-0'>
                    <DatatableWrapper
                        queryKey='ShopSubcategory-data'
                        fetchUrl='/api/master/shop-subcategory'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint='/api/master/shop-subcategory/export'
                        deleteEndpoint='/api/master/shop-subcategory/delete'
                        deleteType='SD'
                        trashView={`${MASTER_TRASH}?trashof=shop-subcategory`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowShopSubcategory
