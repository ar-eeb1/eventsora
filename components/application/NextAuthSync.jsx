'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '@/store/reducer/authReducer'
import { useRouter } from 'next/navigation'
import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
import { PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'
import { MASTER_DASHBOARD } from '@/routes/MasterPanelRoute'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import axios from 'axios'

export default function NextAuthSync() {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const router = useRouter()
    const isAuthenticated = useSelector(state => state.authStore.auth)
    const syncInProgress = useRef(false)

    // Handle NextAuth Sync
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            if (session.user.isExpired) {
                router.push('/expire')
                return
            }

            if (!isAuthenticated) {
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
            }
        }
    }, [session, status, dispatch, router, isAuthenticated])

    // Handle Session Validity Sync (Custom Auth)
    useEffect(() => {
        const verifySession = async () => {
            if (isAuthenticated && status !== 'authenticated' && !syncInProgress.current) {
                syncInProgress.current = true
                try {
                    const { data } = await axios.get('/api/auth/me')
                    if (!data.success) {
                        dispatch(logout())
                    }
                } catch (error) {
                    dispatch(logout())
                } finally {
                    syncInProgress.current = false
                }
            }
        }

        // Only run if NextAuth is NOT loading
        if (status !== 'loading') {
            verifySession()
        }
    }, [isAuthenticated, status, dispatch])

    return null
}
