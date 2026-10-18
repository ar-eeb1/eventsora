'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import BreadCrumb from '@/components/application/BreadCrumb'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { PROVIDER_DASHBOARD, PROVIDER_MESSAGES, PROVIDER_PRODUCT_ORDERS } from '@/routes/ProviderPanelRoute'
import { SHOP_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { socket } from '@/lib/socket'

const formatPrice = (amount) => new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
}).format(Number(amount) || 0)

const label = (value) => value
    ? value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
    : 'Unknown'

const nextActions = {
    confirmed: [{ status: 'accepted', title: 'Accept order' }, { status: 'rejected', title: 'Decline order' }],
    accepted: [{ status: 'preparing', title: 'Start preparing' }],
    preparing: [{ status: 'ready_to_ship', title: 'Mark ready to ship' }],
    ready_to_ship: [{ status: 'shipped', title: 'Mark as shipped' }],
    shipped: [{ status: 'fulfilled', title: 'Mark delivered' }],
}

export default function SellerProductOrderDetailsPage() {
    const { orderId } = useParams()
    const { data: result, loading, error, refetch } = useFetch(`/api/provider/product-orders/${orderId}`)
    const [working, setWorking] = useState(false)
    const [messageLoading, setMessageLoading] = useState(false)
    const order = result?.data

    useEffect(() => {
        const refreshOrder = (event) => {
            if (event?.orderId === orderId) refetch()
        }
        socket.on('order:updated', refreshOrder)
        return () => socket.off('order:updated', refreshOrder)
    }, [orderId, refetch])

    const updateStatus = async (status) => {
        setWorking(true)
        try {
            const response = await fetch(`/api/provider/product-orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            const body = await response.json()
            if (!response.ok || !body.success) throw new Error(body.message || 'Could not update this order.')
            showToast('success', body.message)
            refetch()
        } catch (updateError) {
            showToast('error', updateError.message || 'Could not update this order.')
        } finally {
            setWorking(false)
        }
    }

    const messageCustomer = async () => {
        setMessageLoading(true)
        try {
            const response = await fetch(`/api/provider/product-orders/${orderId}`, { method: 'POST' })
            const body = await response.json()
            if (!response.ok || !body.success) throw new Error(body.message || 'Could not open a conversation.')
            window.location.assign(`${PROVIDER_MESSAGES}/${body.data.conversationId}`)
        } catch (messageError) {
            showToast('error', messageError.message || 'Could not open a conversation.')
            setMessageLoading(false)
        }
    }

    return (
        <div className='space-y-5'>
            <BreadCrumb breadCrumbData={[
                { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
                { href: PROVIDER_PRODUCT_ORDERS, label: 'Shop Orders' },
                { href: '', label: order?.orderNumber || 'Order Details' },
            ]} />
            {loading ? <p className='py-8 text-center text-sm text-gray-500'>Loading order details...</p>
                : error ? <p role='alert' className='rounded border border-red-200 bg-red-50 p-5 text-sm text-red-700'>{error}</p>
                    : !order ? <p className='py-8 text-center text-sm text-gray-500'>Order not found.</p>
                        : (
                            <section className='rounded border bg-white shadow-sm'>
                                <header className='flex flex-wrap items-start justify-between gap-4 border-b p-5'>
                                    <div>
                                        <h1 className='text-xl font-semibold'>Order {order.orderNumber}</h1>
                                        <p className='mt-1 text-sm text-gray-600'>Placed {new Date(order.createdAt).toLocaleString('en-PK')}</p>
                                    </div>
                                    <div className='text-sm'>
                                        <p>Order status: <strong>{label(order.status)}</strong></p>
                                        <p>Payment status: <strong>{label(order.paymentStatus)}</strong></p>
                                    </div>
                                </header>
                                <div className='grid gap-6 p-5 lg:grid-cols-2'>
                                    <section>
                                        <h2 className='mb-3 text-lg font-semibold'>Customer and delivery</h2>
                                        {order.deliveryDate && (
                                            <div className='mb-4 rounded border border-pink-200 bg-pink-50 p-4'>
                                                <p className='text-xs font-semibold uppercase tracking-wide text-pink-800'>Requested delivery</p>
                                                <p className='mt-1 text-lg font-bold text-pink-950'>
                                                    {order.deliveryDate} at {order.deliveryTime} {order.deliveryTimeZone || 'Asia/Karachi'}
                                                </p>
                                            </div>
                                        )}
                                        <dl className='space-y-2 text-sm'>
                                            <div><dt className='inline font-medium'>Name: </dt><dd className='inline'>{order.customerName}</dd></div>
                                            <div><dt className='inline font-medium'>Email: </dt><dd className='inline'>{order.customerEmail}</dd></div>
                                            <div><dt className='inline font-medium'>Phone: </dt><dd className='inline'>{order.customerPhone}</dd></div>
                                            <div><dt className='inline font-medium'>Delivery address: </dt><dd className='inline'>{order.shippingAddress}</dd></div>
                                            {order.note && <div><dt className='inline font-medium'>Customer note: </dt><dd className='inline'>{order.note}</dd></div>}
                                        </dl>
                                        <button type='button' onClick={messageCustomer} disabled={messageLoading} className='mt-4 rounded border border-pink-900 px-4 py-2 text-sm font-medium text-pink-900 disabled:opacity-50'>
                                            {messageLoading ? 'Opening messages...' : 'Message customer'}
                                        </button>
                                    </section>
                                    <section>
                                        <h2 className='mb-3 text-lg font-semibold'>Items ordered</h2>
                                        <ul className='divide-y rounded border'>
                                            {order.items?.map((item, index) => (
                                                <li key={`${item.sku}-${index}`} className='flex justify-between gap-4 p-3 text-sm'>
                                                    <div>
                                                        {item.product?.slug && item.product?.category?.slug ? (
                                                            <Link href={SHOP_PRODUCT_DETAILS(item.product.category.slug, item.product.slug)} target='_blank' rel='noopener noreferrer' className='font-medium text-pink-900 hover:underline'>
                                                                {item.productName}
                                                            </Link>
                                                        ) : (
                                                            <p className='font-medium'>{item.productName}</p>
                                                        )}
                                                        {item.variantName && <p className='text-gray-500'>Variant: {item.variantName}</p>}
                                                        <p className='text-gray-600'>SKU: {item.sku} · Quantity: {item.quantity} · {formatPrice(item.unitPrice)} each</p>
                                                    </div>
                                                    <p className='whitespace-nowrap font-semibold'>{formatPrice(item.lineTotal)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className='mt-3 flex justify-between border-t pt-3 font-semibold'>
                                            <span>Order total</span>
                                            <span>{formatPrice(order.totalAmount)}</span>
                                        </div>
                                    </section>
                                </div>
                                <footer className='flex flex-wrap gap-2 border-t p-5'>
                                    {(nextActions[order.status] || []).map((action) => (
                                        <button
                                            key={action.status}
                                            type='button'
                                            disabled={working}
                                            onClick={() => updateStatus(action.status)}
                                            className={`rounded px-4 py-2 text-sm font-medium disabled:opacity-50 ${action.status === 'rejected' ? 'border border-red-300 text-red-700' : 'bg-pink-900 text-white hover:bg-pink-800'}`}
                                        >
                                            {working ? 'Updating...' : action.title}
                                        </button>
                                    ))}
                                    <Link href={PROVIDER_PRODUCT_ORDERS} className='rounded border px-4 py-2 text-sm font-medium'>Back to orders</Link>
                                </footer>
                            </section>
                        )}
        </div>
    )
}
