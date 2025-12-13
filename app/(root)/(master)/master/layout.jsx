import AppSidebar from '@/components/application/Master/AppSidebar'
import Topbar from '@/components/application/Provider/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex w-full">
                <AppSidebar />
                <main className="flex-1">
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