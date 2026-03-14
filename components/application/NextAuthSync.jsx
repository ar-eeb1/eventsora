'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter } from 'next/navigation'
import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
import { PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'
import { MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

export default function NextAuthSync() {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // NextAuth login succeeded and our backend updated MongoDB and cookies
            // Now sync the frontend Redux state
            const userData = {
                _id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role || 'user',
                avatar: {
                    url: session.user.image
                }
            }
            dispatch(login(userData))

            // Redirect based on role
            const roleRoutes = {
                user: USER_DASHBOARD,
                provider: PROVIDER_DASHBOARD,
                admin: ADMIN_DASHBOARD,
                master: MASTER_DASHBOARD,
                suspended: ''
            }

            router.push(roleRoutes[userData.role] || "/")
        }
    }, [session, status, dispatch, router])

    return null
}
