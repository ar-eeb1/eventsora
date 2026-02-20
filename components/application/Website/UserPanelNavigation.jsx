'use client'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import { USER_BOOKINGS, USER_DASHBOARD, USER_PROFILE } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import { Dashboard, Person } from '@mui/icons-material'
import { CalendarIcon } from '@mui/x-date-pickers'
import axios from 'axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

const UserPanelNavigation = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }

            dispatch(logout())
            router.push(WEBSITE_LOGIN)
            showToast('success', logoutResponse.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }


    return (
        <div className='border shadow-sm p-4 rounded'>
            <ul>
                <li className='mb-2'>
                    <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ? 'bg-primary text-white' : ''}`}>
                        <Dashboard />
                        Dashboard
                    </Link>
                </li>
                <li className='mb-2'>
                    <Link href={USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_PROFILE) ? 'bg-primary text-white' : ''}`}>
                        <Person />
                        Profile
                    </Link>
                </li>
                <li className='mb-2'>
                    <Link href={USER_BOOKINGS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_BOOKINGS) ? 'bg-primary text-white' : ''}`}>
                        <CalendarIcon />
                        Bookings
                    </Link>
                </li>
                <li className='mb-2'>
                    <Button type='button' onClick={handleLogout} variant='destructive' className='w-full cursor-pointer'>
                        Logout
                    </Button>
                </li>
            </ul>
        </div>
    )
}

export default UserPanelNavigation
