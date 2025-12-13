'use client'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import user from '@/public/assets/user.png'
import { useSelector } from 'react-redux'
import { ChevronDown, Settings, User } from 'lucide-react'
import LogoutButton from './LogoutButton'

const UserDropdown = () => {
    const auth = useSelector((store) => store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <div className='flex items-center scroll-auto justify-center gap-4 cursor-pointer'>
                    <ChevronDown className='hidden md:block' size={20} />
                    <p className='text-md hidden md:block'>{auth?.name?.toUpperCase()}</p>
                    <Avatar className='flex items-center justify-center w-6 h-6 rounded-full '>
                        <AvatarImage className='w-4 h-4 dark:filter dark:invert' src={user.src} />
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-5 w-44'>

                <DropdownMenuItem className='md:hidden block'>{auth?.name?.toUpperCase()}</DropdownMenuItem>
                <DropdownMenuSeparator className='lg:hidden block' />
                <DropdownMenuItem className='cursor-pointer'><User /> Profile</DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'><Settings /> Setting</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
