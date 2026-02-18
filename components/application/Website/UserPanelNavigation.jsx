import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
import { Dashboard, Person } from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const UserPanelNavigation = () => {
    const pathname = usePathname()
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
                    <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ? 'bg-primary text-white' : ''}`}>
                        <Person />
                        Profile
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default UserPanelNavigation
