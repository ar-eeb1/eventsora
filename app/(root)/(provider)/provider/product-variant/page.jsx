'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { PROVIDER_DASHBOARD, PROVIDER_PRODUCT_VARIANT_ADD, PROVIDER_PRODUCT_VARIANT_EDIT, PROVIDER_PRODUCT_VARIANT_SHOW, PROVIDER_TRASH } from '@/routes/ProviderPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: PROVIDER_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
]

const ShowProductVariant = () => {
    const columns = useMemo(() => columnConfig(DT_PRODUCT_VARIANT_COLUMN), [])
    const action = useCallback((row, deleteType, handleDelete) => [
        <EditAction key='edit' href={PROVIDER_PRODUCT_VARIANT_EDIT(row.original._id)} />,
        <DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ], [])

    return <div><BreadCrumb breadCrumbData={breadCrumbData} /><Card className='gap-0 overflow-auto rounded shadow-sm'>
        <CardHeader className='border-b px-3 pt-3 [.border-b]:pb-2'><div className='flex items-center justify-between'><h4 className='text-xl font-semibold'>Show Product Variants</h4><Button asChild><Link href={PROVIDER_PRODUCT_VARIANT_ADD}><FilePlus />New Product Variant</Link></Button></div></CardHeader>
        <CardContent className='px-0'><DatatableWrapper queryKey='product-variant-data' fetchUrl='/api/provider/product-variant' initialPageSize={10} columnsConfig={columns} exportEndpoint='/api/provider/product-variant/export' deleteEndpoint='/api/provider/product-variant/delete' deleteType='SD' trashView={`${PROVIDER_TRASH}?trashof=product-variant`} createAction={action} /></CardContent>
    </Card></div>
}

export default ShowProductVariant
