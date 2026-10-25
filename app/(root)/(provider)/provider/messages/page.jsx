'use client'
import React, { useEffect, useRef } from 'react'
import useFetch from '@/hooks/useFetch'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import img from '@/public/assets/profile.png' // Default image
import { messageApiUrl } from '@/lib/messageApi'
import { joinSocketRooms, socket } from '@/lib/socket'
const ProviderMessages = () => {
    const { auth: user } = useSelector(state => state.authStore)
    const { data: conversationData, setData: setConversationData, loading, refetch: refetchConversation } = useFetch(
        messageApiUrl('/conversation/get'),
        'GET',
        { withCredentials: true }
    )
    const conversationsRef = useRef([])

    useEffect(() => {
        conversationsRef.current = conversationData?.data || []
    }, [conversationData])

    useEffect(() => {
        if (!user?._id) return

        const cleanupRooms = joinSocketRooms({ userId: user._id })
        const handleConversationUpdate = (update) => {
            const existingConversation = conversationsRef.current.some(
                (conversation) => conversation._id === update.conversationId
            )

            if (!existingConversation) {
                refetchConversation()
                return
            }

            setConversationData((prev) => {
                if (!prev?.data) return prev
                const updatedConversations = prev.data.map((conversation) =>
                    conversation._id === update.conversationId
                        ? {
                            ...conversation,
                            lastMessage: update.lastMessage,
                            updatedAt: update.updatedAt,
                            isRead: false,
                        }
                        : conversation
                )
                updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                return { ...prev, data: updatedConversations }
            })
        }

        socket.on('conversation-update', handleConversationUpdate)
        return () => {
            cleanupRooms()
            socket.off('conversation-update', handleConversationUpdate)
        }
    }, [user?._id, refetchConversation, setConversationData])

    if (loading) return <div>Loading messages...</div>
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <div className="grid gap-4">
                {conversationData?.data?.map((conv) => {
                    // Find the "other" participant to display their name/image
                    const otherParticipant = conv.participants.find(p => p._id !== user?._id) || {}

                    return (
                        <Link
                            href={`/provider/messages/${conv._id}`}
                            key={conv._id}
                            className="block p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={otherParticipant.profileImage || img.src}
                                    width={50}
                                    height={50}
                                    alt="Profile"
                                    className="rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{otherParticipant.name || 'User'}</h3>
                                    {conv.listingId?.name && (
                                        <p className="text-xs text-gray-400">Regarding: {conv.listingId.name}</p>
                                    )}
                                    <p className={`text-sm ${conv.isRead ? 'text-gray-500' : 'text-primary font-medium'}`}>
                                        {conv.lastMessage || 'No messages yet'}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    )
                })}
                {conversationData?.data?.length === 0 && (
                    <p className="text-gray-500 text-center py-10">No messages yet.</p>
                )}
            </div>
        </div>
    )
}
export default ProviderMessages