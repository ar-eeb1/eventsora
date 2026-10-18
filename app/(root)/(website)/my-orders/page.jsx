'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import UserPanelLayout from '@/components/application/Website/UserPanelLayout'
import useFetch from '@/hooks/useFetch'
import { USER_DASHBOARD, USER_ORDERS, WEBSITE } from '@/routes/WebsiteRoute'
import React, { useEffect } from 'react'
import { socket } from '@/lib/socket'

const breadCrumbData = [
    { href: WEBSITE, label: 'Home' },
    { href: USER_DASHBOARD, label: 'My Account' },
    { href: '', label: 'My Orders' },
]

const formatPrice = (amount) => new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
}).format(Number(amount) || 0)

const formatStatus = (status) => status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Unknown'

const MyOrders = () => {
    const { data: orderData, loading, error, refetch } = useFetch('/api/website/user-orders')
    const orders = orderData?.data || []

    useEffect(() => {
        socket.on('order:created', refetch)
        socket.on('order:updated', refetch)
        return () => {
            socket.off('order:created', refetch)
            socket.off('order:updated', refetch)
        }
    }, [refetch])

    return (
        <div>
            <div className='pl-10 pt-10'>
                <BreadCrumb breadCrumbData={breadCrumbData} />
            </div>
            <UserPanelLayout>
                <div className='mb-5 rounded shadow'>
                    <div className='border p-5 text-xl font-semibold'>
                        My Orders
                    </div>
                    <div className='p-5'>
                        {loading ? (
                            <p className='py-5 text-center text-sm text-gray-500'>Loading your orders...</p>
                        ) : error ? (
                            <p role='alert' className='py-5 text-center text-sm text-red-600'>{error}</p>
                        ) : orders.length === 0 ? (
                            <p className='py-5 text-center text-sm text-gray-500'>You have not placed any product orders yet.</p>
                        ) : (
                            <div className='overflow-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr>
                                            {['Sr.No', 'Order ID', 'Seller', 'Items', 'Amount', 'Order Status', 'Payment', 'Delivery', 'Date'].map((heading) => (
                                                <th key={heading} className='whitespace-nowrap border-b p-2 text-start text-sm text-gray-500'>
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr key={order._id}>
                                                <td className='whitespace-nowrap p-2 text-sm font-bold text-gray-500'>{index + 1}</td>
                                                <td className='whitespace-nowrap p-2 text-sm font-bold text-gray-700'>{order.orderNumber}</td>
                                                <td className='whitespace-nowrap p-2 text-sm text-gray-600'>{order.seller?.name || 'Eventsora seller'}</td>
                                                <td className='min-w-48 p-2 text-sm text-gray-600'>
                                                    {order.items?.map((item, itemIndex) => (
                                                        <div key={`${item.sku}-${itemIndex}`}>
                                                            {item.productName}{item.variantName ? ` (${item.variantName})` : ''} × {item.quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className='whitespace-nowrap p-2 text-sm font-bold text-gray-500'>{formatPrice(order.totalAmount)}</td>
                                                <td className='whitespace-nowrap p-2 text-sm text-gray-500'>{formatStatus(order.status)}</td>
                                                <td className='whitespace-nowrap p-2 text-sm text-gray-500'>{formatStatus(order.paymentStatus)}</td>
                                                <td className='whitespace-nowrap p-2 text-sm text-gray-500'>
                                                    {order.deliveryDate ? `${order.deliveryDate} ${order.deliveryTime} ${order.deliveryTimeZone || 'Asia/Karachi'}` : '—'}
                                                </td>
                                                <td className='whitespace-nowrap p-2 text-sm text-gray-500'>
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </UserPanelLayout>
        </div>
    )
}

export default MyOrders
