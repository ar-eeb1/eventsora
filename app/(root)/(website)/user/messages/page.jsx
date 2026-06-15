'use client'
import useFetch from '@/hooks/useFetch'
import { useSelector } from 'react-redux'
import img from '@/public/assets/profile.png' // Default image
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

const MessagesPage = () => {
    const { auth: user } = useSelector(state => state.authStore)
    const { data: conversationData, loading, refetch: refetchConversation } = useFetch(`/api/message/conversation/get`)

    // Polling for conversation list
    useEffect(() => {
        const interval = setInterval(() => {
            refetchConversation()
        }, 3000)

        return () => clearInterval(interval)
    }, [refetchConversation])

    if (loading && !conversationData) return <div className="p-5">Messages Loading...</div>

    return (
        <div className='flex mx-auto p-5 gap-5 min-h-[calc(100vh-200px)] '>
            <div className='w-1/4 border flex flex-col gap-5 p-3'>
                {conversationData?.data?.map((conv) => {
                    // For user view: Show listing details
                    const listing = conv.listingId || {}
                    const otherParticipant = conv.participants.find(p => p._id !== user?._id) || {}

                    return (
                        <Link
                            href={`/user/messages/${conv._id}`}
                            key={conv._id}
                            className="block p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={listing.media?.[0]?.secure_url || img.src}
                                    width={50}
                                    height={50}
                                    alt="Listing"
                                    className="rounded-full object-cover w-[50px] h-[50px]"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg line-clamp-1">{listing.name || otherParticipant.name}</h3>
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

            <div className='w-3/4 border flex flex-col h-[calc(100vh-140px)] rounded-lg shadow-sm  dark:bg-gray-800 justify-center items-center text-gray-400'>
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                    <h3 className="text-xl font-semibold">Select a conversation</h3>
                    <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
            </div>
        </div >
    )
}

export default MessagesPage
