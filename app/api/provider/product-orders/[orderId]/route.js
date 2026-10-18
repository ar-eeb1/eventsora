import { proxyBackendRequest } from '@/lib/backendApiProxy'

const getBackendPath = async (params) => {
    const { orderId } = await params
    return `/api/seller/product-orders/${encodeURIComponent(orderId)}`
}

export async function GET(request, { params }) {
    return proxyBackendRequest(request, await getBackendPath(params))
}

export async function POST(request, { params }) {
    return proxyBackendRequest(request, await getBackendPath(params))
}

export async function PATCH(request, { params }) {
    return proxyBackendRequest(request, await getBackendPath(params))
}
