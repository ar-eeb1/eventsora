'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import DeleteAction from '@/components/application/Main/deleteAction'
import EditAction from '@/components/application/Main/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_PRODUCT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { PROVIDER_DASHBOARD, PROVIDER_PRODUCT_ADD, PROVIDER_PRODUCT_EDIT, PROVIDER_PRODUCT_SHOW, PROVIDER_TRASH } from '@/routes/ProviderPanelRoute'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: PROVIDER_PRODUCT_SHOW, label: 'Products' },
]

const ShowProduct = () => {
  const columns = useMemo(() => columnConfig(DT_PRODUCT_COLUMN), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction key='edit' href={PROVIDER_PRODUCT_EDIT(row.original._id)} />,
      <DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div className=''>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className='py-0 rounded shadow-sm gap-0 overflow-auto'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className='flex items-center justify-between'>
            <h4 className='text-xl font-semibold'>Show Products</h4>
            <Button asChild>
              <Link href={PROVIDER_PRODUCT_ADD}>
                <FilePlus />
                New Product
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className='px-0 '>
          <DatatableWrapper
            queryKey='product-data'
            fetchUrl='/api/provider/product'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/provider/product/export'
            deleteEndpoint='/api/provider/product/delete'
            deleteType='SD'
            trashView={`${PROVIDER_TRASH}?trashof=product`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowProduct
