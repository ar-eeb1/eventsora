import axios from 'axios'

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001')
    .replace(/\/+$/, '')

export const messageApi = axios.create({
    baseURL: `${backendUrl}/api/message`,
    withCredentials: true,
})

export const messageApiUrl = (path) =>
    `${backendUrl}/api/message${path.startsWith('/') ? path : `/${path}`}`
