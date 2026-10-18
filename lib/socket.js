import { io } from 'socket.io-client'

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

export const socket = io(socketUrl, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    withCredentials: true,
})

export const joinSocketRooms = ({ userId, conversationId, admin = false } = {}) => {
    const joinRooms = () => {
        if (userId) socket.emit('join-user', String(userId))
        if (conversationId) socket.emit('join-chat', String(conversationId))
        if (admin) socket.emit('join-admin')
    }

    socket.on('connect', joinRooms)
    socket.connect()
    if (socket.connected) joinRooms()

    return () => socket.off('connect', joinRooms)
}

export const emitSocketEvent = (event, payload) => new Promise((resolve, reject) => {
    const emit = () => {
        socket.emit(event, payload)
        resolve()
    }

    if (socket.connected) {
        emit()
        return
    }

    const handleConnect = () => {
        cleanup()
        emit()
    }
    const handleError = (error) => {
        cleanup()
        reject(error)
    }
    const cleanup = () => {
        socket.off('connect', handleConnect)
        socket.off('connect_error', handleError)
    }

    socket.once('connect', handleConnect)
    socket.once('connect_error', handleError)
    socket.connect()
})