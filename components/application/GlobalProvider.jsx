'use client'
import { persistor, store } from '@/store/store'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import NextAuthProvider from './NextAuthProvider'
import NextAuthSync from './NextAuthSync'

const queryClient = new QueryClient()

const GlobalProvider = ({ children }) => {
    return (
        <NextAuthProvider>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate persistor={persistor} loading={<Loading />}>
                        <NextAuthSync />
                        {children}
                    </PersistGate>
                </Provider>
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            </QueryClientProvider>
        </NextAuthProvider>
    )
}

export default GlobalProvider
