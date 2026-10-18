import { NextResponse } from 'next/server'

const backendBaseUrl = () => (
    process.env.BACKEND_URL
    || process.env.NEXT_PUBLIC_BACKEND_URL
    || 'http://localhost:5001'
).replace(/\/+$/, '')

export const proxyBackendRequest = async (request, backendPath) => {
    const targetUrl = `${backendBaseUrl()}${backendPath}${request.nextUrl.search}`
    const headers = new Headers()
    for (const name of ['cookie', 'authorization', 'content-type', 'accept']) {
        const value = request.headers.get(name)
        if (value) headers.set(name, value)
    }

    const method = request.method.toUpperCase()
    const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer()

    try {
        const upstream = await fetch(targetUrl, {
            method,
            headers,
            body: body?.byteLength ? body : undefined,
            cache: 'no-store',
        })
        const responseBody = upstream.status === 204 ? null : await upstream.arrayBuffer()
        return new NextResponse(responseBody, {
            status: upstream.status,
            headers: {
                'content-type': upstream.headers.get('content-type') || 'application/json',
            },
        })
    } catch (error) {
        console.error(`Backend API proxy failed for ${backendPath}:`, error)
        return NextResponse.json(
            { success: false, statusCode: 502, message: 'Backend service is unavailable.' },
            { status: 502 }
        )
    }
}
