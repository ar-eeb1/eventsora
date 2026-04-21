import Topbar from '@/components/application/Provider/Topbar'
import AppSidebar from '@/components/application/Provider/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { isAuthenticated } from '@/lib/authentication'
import { redirect } from 'next/navigation'

const layout = async ({ children }) => {
    const auth = await isAuthenticated('provider')
    if (auth.isExpired) redirect('/expire')

    return (
        <SidebarProvider>
            <div className="flex w-full">

                <AppSidebar />

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
