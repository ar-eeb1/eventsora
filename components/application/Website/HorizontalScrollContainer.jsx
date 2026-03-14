'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HorizontalScrollContainer = ({ children }) => {
    const scrollRef = useRef(null)
    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(true)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeft(scrollLeft > 0)
            setShowRight(scrollLeft < scrollWidth - clientWidth - 5) // 5px buffer
        }
    }

    useEffect(() => {
        const currentRef = scrollRef.current
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll)
            handleScroll() // Initial check
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    return (
        <div className="relative group">
            {/* Left Button */}
            {showLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg border border-gray-200 transition-all hidden md:flex items-center justify-center -translate-x-4"
                    aria-label="Scroll Left"
                >
                    <ChevronLeft className="text-pink-900" size={24} />
                </button>
            )}

            {/* Scrollable Area */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth rounded-lg pt-10"
            >
                {children}
            </div>

            {/* Right Button */}
            {showRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg border border-gray-200 transition-all hidden md:flex items-center justify-center translate-x-4"
                    aria-label="Scroll Right"
                >
                    <ChevronRight className="text-pink-900" size={24} />
                </button>
            )}

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </div>
    )
}

export default HorizontalScrollContainer
