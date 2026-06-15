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
import { IoPricetagOutline, IoClose } from 'react-icons/io5'
import Pusher from 'pusher-js'




const ProviderChatPage = () => {
    const { id } = useParams()
    const { auth: user } = useSelector(state => state.authStore)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [isQuoteMode, setIsQuoteMode] = useState(false)
    const [quotePrice, setQuotePrice] = useState('')
    const [quoteDate, setQuoteDate] = useState('')
    const scrollRef = useRef()

    // auto scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    // 1 FETCH OLD MESSAGES
    const { data: messageData, refetch } = useFetch(`/api/message/get/${id}`)

    // Real-time messages with Pusher
    useEffect(() => {
        if (!id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        })

        const channel = pusher.subscribe(`chat-${id}`)

        // Listen for messages in current chat
        channel.bind('new-message', (data) => {
            setMessages((prev) => {
                if (prev.find((msg) => msg._id === data._id)) return prev
                return [...prev, data]
            })

            // Also update the current conversation's preview in the sidebar
            setConversationData((prev) => {
                if (!prev?.data) return prev
                const updatedConversations = prev.data.map((conv) => {
                    if (conv._id === id) {
                        return {
                            ...conv,
                            lastMessage: data.text,
                            updatedAt: data.createdAt,
                            isRead: true
                        }
                    }
                    return conv
                })
                updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                return { ...prev, data: updatedConversations }
            })
        })

        // Listen for sidebar updates (for all chats)
        const userChannel = pusher.subscribe(`user-${user?._id}`)
        userChannel.bind('conversation-update', (data) => {
            setConversationData((prev) => {
                if (!prev?.data) return prev
                const updatedConversations = prev.data.map((conv) => {
                    if (conv._id === data.conversationId) {
                        return {
                            ...conv,
                            lastMessage: data.lastMessage,
                            updatedAt: data.updatedAt,
                            isRead: data.conversationId === id // Read if we are looking at it
                        }
                    }
                    return conv
                })
                // Sort by last message time
                updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                return { ...prev, data: updatedConversations }
            })
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            userChannel.unbind_all()
            userChannel.unsubscribe()
        }
    }, [id, user?._id])

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
        const currentConv = conversationData?.data?.find(c => c._id === id)
        
        try {
            const { data } = await axios.post(`/api/message/send`, {
                conversationId: id,
                text: isQuoteMode ? `Price Quotation: Rs. ${quotePrice} for ${quoteDate} - ${newMessage}` : newMessage,
                isQuote: isQuoteMode,
                quotePrice: isQuoteMode ? Number(quotePrice) : null,
                quoteListingId: currentConv?.listingId?._id || null,
                quoteDate: isQuoteMode ? quoteDate : null
            })

            if (data.success) {
                setMessages([...messages, data.data])
                setNewMessage('')
                setQuotePrice('')
                setQuoteDate('')
                setIsQuoteMode(false)
            }

        } catch (error) {
            showToast('error', error.response?.data?.message || 'Failed to send')
        } finally {
            setSending(false)
        }
    }

    const { data: conversationData, setData: setConversationData, loading, refetch: refetchConversation } = useFetch(`/api/message/conversation/get`)

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
                                    <div className="flex justify-between items-center mt-1">
                                        <p className={`text-xs flex-1 line-clamp-1 ${conv.isRead ? 'text-gray-500' : 'text-primary font-bold'}`}>
                                            {conv.lastMessage || 'No messages yet'}
                                        </p>
                                        {!conv.isRead && (
                                            <span className="w-2 h-2 bg-primary rounded-full ml-2 shrink-0 animate-pulse" />
                                        )}
                                    </div>
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
                                    {msg.isQuote ? (
                                        <div className="bg-white/10 p-3 rounded-md border border-white/20 mb-2">
                                            <div className="flex items-center gap-2 text-white mb-1">
                                                <IoPricetagOutline className="text-xl" />
                                                <span className="font-bold text-sm uppercase">Price Quotation</span>
                                            </div>
                                            <p className="text-2xl font-bold">{Number(msg.quotePrice).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</p>
                                            {msg.quoteDate && (
                                                <div className="flex items-center gap-1 text-xs text-white/80 mt-1 uppercase font-semibold">
                                                    <span className="opacity-70">On:</span> {msg.quoteDate}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
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
                <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    {isQuoteMode && (
                        <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-primary uppercase mb-1 block">Quotation Amount (PKR)</label>
                                <input
                                    type="number"
                                    value={quotePrice}
                                    onChange={(e) => setQuotePrice(e.target.value)}
                                    placeholder="Enter price..."
                                    className="w-full bg-transparent border-none p-0 text-lg font-bold text-primary focus:ring-0 placeholder:text-primary/30"
                                    autoFocus
                                />
                            </div>
                            <div className="flex-1 border-l border-primary/20 pl-3">
                                <label className="text-xs font-bold text-primary uppercase mb-1 block">For Date</label>
                                <input
                                    type="date"
                                    value={quoteDate}
                                    onChange={(e) => setQuoteDate(e.target.value)}
                                    className="w-full bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0"
                                />
                            </div>
                            <button 
                                onClick={() => setIsQuoteMode(false)}
                                className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors"
                            >
                                <IoClose size={20} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={() => setIsQuoteMode(!isQuoteMode)}
                            className={`p-2.5 rounded-lg border transition-all ${isQuoteMode ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                            title="Send Price Quote"
                        >
                            <IoPricetagOutline size={20} />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={isQuoteMode ? "Add a note to your quote..." : "Type a message..."}
                            className="flex-1 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <ButtonLoading
                            loading={sending}
                            type="submit"
                            text="Send"
                            className="bg-primary text-white px-8 py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors"
                            disabled={isQuoteMode && !quotePrice}
                        />
                    </form>
                </div>
            </div>

        </div >
    )
}
export default ProviderChatPage
