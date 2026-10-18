'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import DatatableWrapper from '@/components/application/Main/DatatableWrapper'
import { DT_PRODUCT_ORDER_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { useRouter, useSearchParams } from 'next/navigation'
import { PROVIDER_DASHBOARD, PROVIDER_MESSAGES, PROVIDER_PRODUCT_ORDER_DETAILS } from '@/routes/ProviderPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ViewAction from '@/components/application/Main/ViewAction'
import { ListItemIcon, MenuItem } from '@mui/material'
import { MessageCircle } from 'lucide-react'
import { showToast } from '@/lib/showToast'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '@/lib/socket'

const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Awaiting Acceptance' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_to_ship', label: 'Ready to Ship' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'fulfilled', label: 'Delivered' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
]

const MessageCustomerAction = ({ orderId }) => {
    const openConversation = async () => {
        try {
            const response = await fetch(`/api/provider/product-orders/${orderId}`, { method: 'POST' })
            const result = await response.json()
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Could not open a conversation.')
            }
            window.location.assign(`${PROVIDER_MESSAGES}/${result.data.conversationId}`)
        } catch (error) {
            showToast('error', error.message || 'Could not open a conversation.')
        }
    }

    return (
        <MenuItem onClick={openConversation}>
            <ListItemIcon>
                <MessageCircle size={20} />
            </ListItemIcon>
            Message customer
        </MenuItem>
    )
}

export default function SellerProductOrdersPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const searchParams = useSearchParams()
    const status = searchParams.get('status')
    const fetchUrl = status ? `/api/provider/product-orders?status=${status}` : '/api/provider/product-orders'

    const columns = useMemo(() => columnConfig(DT_PRODUCT_ORDER_COLUMN), [])

    const action = useCallback((row) => {
        const actionMenu = []
        actionMenu.push(<ViewAction key='view' href={PROVIDER_PRODUCT_ORDER_DETAILS(row.original._id)} />)
        actionMenu.push(<MessageCustomerAction key='message' orderId={row.original._id} />)
        return actionMenu
    }, [])

    useEffect(() => {
        const refreshOrders = () => {
            queryClient.invalidateQueries({
                predicate: (query) => typeof query.queryKey[0] === 'string'
                    && query.queryKey[0].startsWith('seller-product-orders-'),
            })
        }

        socket.on('order:new', refreshOrders)
        socket.on('order:updated', refreshOrders)
        return () => {
            socket.off('order:new', refreshOrders)
            socket.off('order:updated', refreshOrders)
        }
    }, [queryClient])

    const selectedStatus = orderStatuses.find((item) => item.value === status)
    const title = selectedStatus
        ? `${selectedStatus.label} Orders`
        : 'All Shop Orders'

    return (
        <div className='space-y-5'>
            <BreadCrumb breadCrumbData={[{ href: PROVIDER_DASHBOARD, label: 'Dashboard' }, { href: '', label: title }]} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <h4 className='text-xl font-semibold'>{title}</h4>
                        <label className='flex items-center gap-2 text-sm font-medium'>
                            <span>Order status</span>
                            <select
                                value={selectedStatus ? status : ''}
                                onChange={(event) => {
                                    const nextStatus = event.target.value
                                    router.push(nextStatus ? `/provider/product-orders?status=${nextStatus}` : '/provider/product-orders')
                                }}
                                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900'
                            >
                                <option value=''>All orders</option>
                                {orderStatuses.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DatatableWrapper
                        queryKey={`seller-product-orders-${status || 'all'}`}
                        fetchUrl={fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
