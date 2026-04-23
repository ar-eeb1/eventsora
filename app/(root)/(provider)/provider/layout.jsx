import Topbar from '@/components/application/Provider/Topbar'
import AppSidebar from '@/components/application/Provider/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { isAuthenticated } from '@/lib/authentication'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/databaseConnection'
import ConversationModel from '@/models/Conversation.model'
import MessageModel from '@/models/Message.model'

const layout = async ({ children }) => {
    const auth = await isAuthenticated('provider')
    if (auth.isExpired) redirect('/expire')

    let hasUnreadMessages = false;
    if (auth.isAuth) {
        await connectDB();
        const conversations = await ConversationModel.find({ participants: auth.userId }).select('_id');
        const conversationIds = conversations.map(c => c._id);
        const unreadCount = await MessageModel.countDocuments({
            conversationId: { $in: conversationIds },
            sender: { $ne: auth.userId },
            readBy: { $ne: auth.userId }
        });
        hasUnreadMessages = unreadCount > 0;
    }

    return (
        <SidebarProvider>
            <div className="flex w-full">

                <AppSidebar hasUnreadMessages={hasUnreadMessages} />

                <main className="flex-1 md:w-[calc(100vw-16rem)] w-full">
                    <Topbar />
                    <div className="pt-16 p-5">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

export default layout
