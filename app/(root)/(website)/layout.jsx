import Footer from '@/components/application/Website/Footer'
import Header from '@/components/application/Website/Header'
import React from 'react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets:['latin']
})

const layout = ({ children }) => {
    return (
        <div className={`${poppins.className} bg-[#FFE7EF]`}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default layout
