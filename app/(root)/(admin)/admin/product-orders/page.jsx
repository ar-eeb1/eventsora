'use client'

import { useState } from 'react'
import BreadCrumb from '@/components/application/BreadCrumb'
import useFetch from '@/hooks/useFetch'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { showToast } from '@/lib/showToast'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { joinSocketRooms, socket } from '@/lib/socket'

const formatPrice = (amount) => new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
}).format(Number(amount) || 0)

const label = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'

export default function AdminProductOrdersPage() {
    const searchParams = useSearchParams()
    const reviewStatus = searchParams.get('reviewStatus')
    const fetchUrl = reviewStatus ? `/api/admin/product-orders?reviewStatus=${reviewStatus}` : '/api/admin/product-orders'
    const { data: result, loading, error, refetch } = useFetch(fetchUrl)
    const [workingId, setWorkingId] = useState(null)
    const orders = result?.data || []
    const title = reviewStatus
        ? `${reviewStatus.charAt(0).toUpperCase() + reviewStatus.slice(1)} Shop Orders`
        : 'All Shop Orders'

    useEffect(() => {
        const cleanupRooms = joinSocketRooms({ admin: true })
        socket.on('order:created', refetch)
        socket.on('order:updated', refetch)
        return () => {
            cleanupRooms()
            socket.emit('leave-admin')
            socket.off('order:created', refetch)
            socket.off('order:updated', refetch)
        }
    }, [refetch])

    const reviewOrder = async (orderId, action) => {
        setWorkingId(orderId)
        try {
            const response = await fetch(`/api/admin/product-orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            })
            const result = await response.json()
            if (!response.ok || !result.success) throw new Error(result.message || 'Could not update this order.')
            showToast('success', result.message)
            refetch()
        } catch (reviewError) {
            showToast('error', reviewError.message || 'Could not update this order.')
        } finally {
            setWorkingId(null)
        }
    }

    return (
        <div className='space-y-5'>
            <BreadCrumb breadCrumbData={[{ href: ADMIN_DASHBOARD, label: 'Dashboard' }, { href: '', label: title }]} />
            <section className='rounded border bg-white shadow-sm'>
                <header className='border-b p-5'>
                    <h1 className='text-xl font-semibold'>{title}</h1>
                    <p className='mt-1 text-sm text-gray-600'>Review orders and verify payment through your payment provider. This dashboard does not charge customers; confirming records your verification and releases the order to its seller.</p>
                </header>
                <div className='space-y-4 p-5'>
                    {loading ? <p className='py-8 text-center text-sm text-gray-500'>Loading orders...</p>
                        : error ? <p role='alert' className='py-8 text-center text-sm text-red-600'>{error}</p>
                            : orders.length === 0 ? <p className='py-8 text-center text-sm text-gray-500'>No {reviewStatus || ''} shop orders yet.</p>
                                : orders.map((order) => (
                                    <article key={order._id} className='rounded border p-4'>
                                        <div className='flex flex-wrap items-start justify-between gap-3'>
                                            <div>
                                                <h2 className='font-semibold'>{order.orderNumber}</h2>
                                                <p className='text-sm text-gray-600'>Placed {new Date(order.createdAt).toLocaleString('en-PK')}</p>
                                                <p className='mt-2 text-sm'>Buyer: {order.customerName} · {order.customerEmail} · {order.customerPhone}</p>
                                                <p className='text-sm'>Seller: {order.seller?.name || 'Unknown seller'} ({order.seller?.email || 'no email'})</p>
                                                <p className='text-sm'>Ship to: {order.shippingAddress}</p>
                                                {order.deliveryDate && <p className='text-sm'>Requested delivery: {order.deliveryDate} at {order.deliveryTime} {order.deliveryTimeZone || 'Asia/Karachi'}</p>}
                                                {order.note && <p className='text-sm'>Note: {order.note}</p>}
                                            </div>
                                            <div className='text-right text-sm'>
                                                <p className='font-semibold'>{formatPrice(order.totalAmount)}</p>
                                                <p>Admin review: {label(order.reviewStatus || (order.releasedAt ? 'accepted' : order.status === 'rejected' ? 'rejected' : 'pending'))}</p>
                                                <p>Order: {label(order.status)}</p>
                                                <p>Payment: {label(order.paymentStatus)}</p>
                                            </div>
                                        </div>
                                        <ul className='my-3 border-y py-2 text-sm text-gray-700'>
                                            {order.items?.map((item, index) => (
                                                <li key={`${item.sku}-${index}`}>{item.productName}{item.variantName ? ` (${item.variantName})` : ''} × {item.quantity} — {formatPrice(item.lineTotal)}</li>
                                            ))}
                                        </ul>
                                        {(order.reviewStatus === 'pending' || (!order.reviewStatus && order.status === 'pending' && order.paymentStatus === 'pending')) && (
                                            <div className='flex flex-wrap gap-2'>
                                                <button disabled={workingId === order._id} onClick={() => reviewOrder(order._id, 'confirm-payment')} className='rounded bg-pink-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50'>
                                                    {workingId === order._id ? 'Updating...' : 'Confirm payment received & send to seller'}
                                                </button>
                                                <button disabled={workingId === order._id} onClick={() => reviewOrder(order._id, 'reject')} className='rounded border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50'>
                                                    Reject order
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                ))}
                </div>
            </section>
        </div>
    )
}
