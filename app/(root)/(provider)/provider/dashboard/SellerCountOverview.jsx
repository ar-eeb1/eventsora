'use client'
import Link from 'next/link'
import { Banknote, CalendarCheck, ClipboardList, Loader2, Truck } from 'lucide-react'
import React, { useEffect } from 'react'
import useFetch from '@/hooks/useFetch'
import { socket } from '@/lib/socket'
import { PROVIDER_PRODUCT_ORDERS, PROVIDER_PRODUCT_ORDERS_ACCEPTANCE, PROVIDER_PRODUCT_ORDERS_DELIVERED } from '@/routes/ProviderPanelRoute'

const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return 'Rs 0'
    return `Rs ${Number(value).toLocaleString('en-PK')}`
}

const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

const SellerCountOverview = () => {
    const { data: countData, loading, refetch } = useFetch('/api/provider/sellerDashboard/count')
    const stats = countData?.data || {}
    const newOrders = Array.isArray(stats.newOrders) ? stats.newOrders : []

    useEffect(() => {
        socket.on('order:new', refetch)
        socket.on('order:updated', refetch)
        return () => {
            socket.off('order:new', refetch)
            socket.off('order:updated', refetch)
        }
    }, [refetch])

    const cardStyle = 'group flex items-center justify-between p-4 rounded-xl border bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
    const titleStyle = 'text-sm font-medium text-gray-500 dark:text-gray-400'
    const valueStyle = 'text-2xl font-semibold text-gray-900 dark:text-white'
    const iconWrapper = 'w-12 h-12 flex justify-center items-center rounded-full text-white shadow-md'

    return (
        <div className='space-y-5'>
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5'>
                <Link href={PROVIDER_PRODUCT_ORDERS_ACCEPTANCE}>
                    <div className={cardStyle}>
                        <div>
                            <h4 className={titleStyle}>Total Amount This Month</h4>
                            <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : formatCurrency(stats.totalAmountThisMonth)}</span>
                        </div>
                        <div className={`${iconWrapper} bg-gradient-to-tr from-emerald-500 to-green-600`}>
                            <Banknote size={20} />
                        </div>
                    </div>
                </Link>

                <Link href={PROVIDER_PRODUCT_ORDERS}>
                    <div className={cardStyle}>
                        <div>
                            <h4 className={titleStyle}>Total Orders</h4>
                            <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : stats.totalOrders || 0}</span>
                        </div>
                        <div className={`${iconWrapper} bg-gradient-to-tr from-sky-500 to-blue-600`}>
                            <ClipboardList size={20} />
                        </div>
                    </div>
                </Link>

                <Link href={PROVIDER_PRODUCT_ORDERS_ACCEPTANCE}>
                    <div className={cardStyle}>
                        <div>
                            <h4 className={titleStyle}>Pending</h4>
                            <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : stats.pendingOrders || 0}</span>
                        </div>
                        <div className={`${iconWrapper} bg-gradient-to-tr from-amber-400 to-orange-500`}>
                            <CalendarCheck size={20} />
                        </div>
                    </div>
                </Link>

                <Link href={PROVIDER_PRODUCT_ORDERS_DELIVERED}>
                    <div className={cardStyle}>
                        <div>
                            <h4 className={titleStyle}>Delivered</h4>
                            <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : stats.deliveredOrders || 0}</span>
                        </div>
                        <div className={`${iconWrapper} bg-gradient-to-tr from-violet-500 to-purple-600`}>
                            <Truck size={20} />
                        </div>
                    </div>
                </Link>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60'>
                <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-base font-semibold text-gray-900 dark:text-white'>New Orders</h3>
                    <Link href={PROVIDER_PRODUCT_ORDERS} className='text-sm font-medium text-pink-700 hover:text-pink-800'>View all</Link>
                </div>

                {loading ? (
                    <div className='flex items-center justify-center py-6 text-sm text-gray-500'>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Loading recent orders...
                    </div>
                ) : newOrders.length ? (
                    <div className='space-y-3'>
                        {newOrders.map((order) => (
                            <Link key={order._id} href={`/provider/product-orders/${order._id}`} className='block rounded-lg border border-gray-200 p-3 transition hover:border-pink-200 hover:bg-pink-50/60 dark:border-gray-700 dark:hover:border-pink-800 dark:hover:bg-gray-800/70'>
                                <div className='flex items-center justify-between gap-3'>
                                    <div>
                                        <p className='text-sm font-semibold text-gray-900 dark:text-white'>#{order.orderNumber || order._id}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>{order.customerName || 'Customer'} • {new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                                    </div>
                                    <span className='rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'>
                                        {formatStatus(order.status)}
                                    </span>
                                </div>
                                <div className='mt-2 flex items-center justify-between text-sm'>
                                    <span className='text-gray-500 dark:text-gray-400'>Total</span>
                                    <span className='font-semibold text-gray-900 dark:text-white'>{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className='py-6 text-center text-sm text-gray-500'>No new orders found.</p>
                )}
            </div>
        </div>
    )
}

export default SellerCountOverview