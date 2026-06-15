import { showToast } from '@/lib/showToast'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import { logout } from '@/store/reducer/authReducer'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

import { signOut } from 'next-auth/react'

const LogoutButton = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }

            dispatch(logout())
            await signOut({ redirect: false })
            router.push(WEBSITE_LOGIN)
            showToast('success', logoutResponse.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer flex items-center gap-2 bg-red-400 hover:bg-red-500 w-full rounded-md text-white py-1 px-2'>
            <LogOutIcon className='text-white' />
            Logout
        </DropdownMenuItem>
    )
}

export default LogoutButton
