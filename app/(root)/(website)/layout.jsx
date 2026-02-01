'use client'
import Footer from '@/components/application/Website/Footer'
import Header from '@/components/application/Website/Header'
import React from 'react'
import { Poppins } from 'next/font/google'
import { usePathname } from 'next/navigation'

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets: ['latin']
})

const layout = ({ children }) => {
    const pathname = usePathname()
    // Hide footer only on specific chat pages, or all message pages?
    // User asked "right there" (url: /user/messages/[id]).
    // Likely wants it hidden on the list page too for consistency, but definitely on the chat page.
    // Let's hide on any path starting with /user/messages
    const hideFooter = pathname.startsWith('/user/messages')

    return (
        <div className={`${poppins.className} bg-[#FFE7EF]`}>
            <Header />
            <main>
                {children}
            </main>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default layout
