'use client'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ButtonLoading from '@/components/application/ButtonLoading'
import img from '@/public/assets/profile.png' // Default image
import Image from 'next/image'
import Link from 'next/link'


const ProviderChatPage = () => {
    const { id } = useParams()
    const { auth: user } = useSelector(state => state.authStore)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef()

    // auto scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    // 1 FETCH OLD MESSAGES
    const { data: messageData, refetch } = useFetch(`/api/message/get/${id}`)

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 3000)

        return () => clearInterval(interval)
    }, [refetch])

    useEffect(() => {
        if (messageData?.success) {
            setMessages(messageData.data)
        }
    }, [messageData])

    // Mark as read
    useEffect(() => {
        if (id && messages.length > 0) {
            axios.post('/api/message/read', { conversationId: id })
        }
    }, [id, messages.length])

    // 2  SEND MESSAGE HANDLER
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setSending(true)
        try {
            const { data } = await axios.post(`/api/message/send`, {
                conversationId: id,
                text: newMessage
            })

            if (data.success) {
                setMessages([...messages, data.data])
                setNewMessage('')
            }

        } catch (error) {
            showToast('error', error.response?.data?.message || 'Failed to send')
        } finally {
            setSending(false)
        }
    }

    const { data: conversationData, loading, refetch: refetchConversation } = useFetch(`/api/message/conversation/get`)

    // Polling for conversation list
    useEffect(() => {
        const interval = setInterval(() => {
            refetchConversation()
        }, 3000)

        return () => clearInterval(interval)
    }, [refetchConversation])

    if (loading && !conversationData) return <div>Messages Loading...</div>

    return (
        <div className='flex mx-auto p-5 gap-5 min-h-[calc(100vh-200px)] '>
            <div className='w-1/4 border flex flex-col gap-5 p-3'>
                {conversationData?.data?.map((conv) => {
                    const otherParticipant = conv.participants.find(p => p._id !== user?._id) || {}

                    return (
                        <Link
                            href={`/provider/messages/${conv._id}`}
                            key={conv._id}
                            className={`block p-4 rounded-lg border hover:shadow-md transition-shadow ${conv._id === id ? 'bg-primary/5 border-primary' : 'bg-white dark:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={otherParticipant.profileImage || img.src}
                                    width={40}
                                    height={40}
                                    alt="Profile"
                                    className="rounded-full object-cover w-[40px] h-[40px]"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{otherParticipant.name || 'User'}</h3>
                                    {conv.listingId?.name && (
                                        <p className="text-xs text-gray-400 line-clamp-1">Regarding: {conv.listingId.name}</p>
                                    )}
                                    <p className={`text-xs mt-1 ${conv.isRead ? 'text-gray-500' : 'text-primary font-medium'}`}>
                                        {conv.lastMessage || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
                {conversationData?.data?.length === 0 && (
                    <p className="text-gray-500 text-center py-10">No messages yet.</p>
                )}
            </div>

            <div className='w-3/4 border flex flex-col h-[calc(100vh-140px)] rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden'>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#ffe7ef] dark:bg-gray-900">
                    {messages.map((msg) => {
                        const isMyMessage = msg.sender === user?._id || msg.sender?._id === user?._id
                        return (
                            <div key={msg._id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isMyMessage
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-bl-none'
                                    }`}>
                                    <p>{msg.text}</p>
                                    <span className={`text-xs block mt-1 text-right ${isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMyMessage && msg.readBy?.length > 0 && (
                                            <span className="ml-2 font-bold text-white">✓✓</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <ButtonLoading
                        loading={sending}
                        type="submit"
                        text="Send"
                        className="bg-primary text-white px-8 py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors"
                    />
                </form>
            </div>

        </div >
    )
}
export default ProviderChatPage
