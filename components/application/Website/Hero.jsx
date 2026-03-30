import { Minus } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import React from 'react'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin']
})

const Hero = () => {
    return (
        <section className="flex items-center justify-center bg-[#fce5f0] px-6">
            <div className="text-center max-w-4xl">

                {/* Eyebrow */}
                <p className="text-[11px] lg:tracking-[4px] md:tracking-[3px] tracking-[2px] uppercase text-[#861043] lg:mb-6 mb-2 font-medium flex items-center justify-center">
                    <Minus />
                    Pakistan's Premier Event Platform
                    <Minus />
                </p>

                <h1 className="text-[#2B2B2B] text-4xl sm:text-6xl md:text-7xl leading-tight font-light">
                    Plan the Perfect <br />
                    <span className={`italic text-[#861043] font-semibold ${playfair.className}`}>
                        Event
                    </span>, Effortlessly
                </h1>

                {/* Sub Text */}
                <p className="md:mt-8 text-[#5A5A5A] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Discover top venues, caterers, photographers, entertainment & gifts —
                    all in one beautifully curated platform.
                </p>

            </div>
        </section >
    );
}

export default Hero
