import { proxyBackendRequest } from '@/lib/backendApiProxy'

export const POST = (request) => proxyBackendRequest(request, '/api/shop/product-order/delivery-slot')
