import { proxyBackendRequest } from '@/lib/backendApiProxy'

export const GET = (request) => proxyBackendRequest(request, '/api/shop/user-orders')
