import { proxyBackendRequest } from '@/lib/backendApiProxy'

export async function PATCH(request, { params }) {
    const { orderId } = await params
    return proxyBackendRequest(request, `/api/admin/product-orders/${encodeURIComponent(orderId)}`)
}
