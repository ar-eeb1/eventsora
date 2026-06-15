'use client'
import React from 'react'
import logo from '@/public/assets/eventsora.png'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LucideChevronRight, X } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Link from 'next/link'
import { ProviderSidebar } from '@/lib/providerSidebarMenu'

const AppSidebar = ({ hasUnreadMessages }) => {
    const { toggleSidebar } = useSidebar()
    return (
        <Sidebar className='z-50 border-none '>
            <SidebarHeader className=' h-14 p-0 bg-pink-100 dark:bg-card'>
                <div className="px-6 flex justify-between items-center ">
                    <Image className='w-auto h-20 object-contain' src={logo.src} alt='EventSora Logo' width={200} height={200} priority />
                    <Button onClick={toggleSidebar} type='button' size='icon' className='md:hidden w-7 h-7 rounded-full -mr-2 bg-pink-300' >
                        <X className='w-4 h-4' />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className='px-3 py-4 sidebar-scroll overflow-y-auto bg-pink-100 dark:bg-card'>
                <SidebarMenu className='space-y-1'>
                    {ProviderSidebar.map((menu, index) => (
                        <Collapsible key={index} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        asChild
                                        className='h-11 px-3 rounded-lg hover:bg-pink-50 hover:text-pink-700 data-[state=open]:bg-pink-50 data-[state=open]:text-pink-700 transition-all duration-200 group/button'
                                    >
                                        <Link href={menu?.url} className='flex items-center gap-3 w-full relative'>
                                            <menu.icon className='w-5 h-5  text-gray-500 group-hover/button:text-pink-600 transition-colors' />
                                            <span className='flex-1 text-sm font-medium'>{menu.title}</span>
                                            {menu.title === 'Messages' && hasUnreadMessages && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 ml-auto" />
                                            )}
                                            {menu.submenu && menu.submenu.length > 0 && (
                                                <LucideChevronRight className='w-4 h-4 transition-all  duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-400 group-hover/button:text-pink-500' />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {menu.submenu && menu.submenu.length > 0 && (
                                    <CollapsibleContent className='transition-all duration-300 ease-in-out data-[state=closed]:animate-collapse data-[state=open]:animate-expand '>
                                        <SidebarMenuSub className='ml-8 mt-1 mb-1 space-y-0.5 border-l-2 border-pink-200/60 pl-3 py-1'>
                                            {menu.submenu.map((submenuItem, submenuIndex) => (
                                                <SidebarMenuSubItem key={submenuIndex}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className='h-9 px-3 rounded-md dark:text-white text-gray-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200'
                                                    >
                                                        <Link href={submenuItem.url} className='text-sm mt-2 font-normal dark:hover:text-black'>
                                                            {submenuItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar