'use client'
import Footer from '@/components/application/Website/Footer'
import Header from '@/components/application/Website/Header'
import React from 'react'
import { Poppins, Playfair_Display } from 'next/font/google'
import { usePathname } from 'next/navigation'

// body font
const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets: ['latin']
})

// heading font
const playfair = Playfair_Display({
    weight: ['400', '700'],
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
        <div className={`${poppins.className} bg-[#fce5f0]`}>
            <Header />
            {/*
              The root div applies Poppins for normal text. To use Playfair Display
              for titles or headings, add its className to the element needing the
              style. For example:

                <h1 className={playfair.className}>Welcome to Eventsora</h1>

              You can also combine both on the same element if desired:

                <h2 className={`${playfair.className} ${poppins.className}`}>Section</h2>
            */}
            <main>
                {children}
            </main>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default layout
