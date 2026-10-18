import { Search, MessageSquareHeart, CalendarCheck } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import React from 'react'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
})

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-pink-700" />,
            title: "1. Discover",
            description: "Browse verified, top-tier venues and service providers in your city with our advanced filters."
        },
        {
            icon: <MessageSquareHeart className="w-8 h-8 text-pink-700" />,
            title: "2. Connect",
            description: "Send direct inquiries, request custom quotes, and chat with vendors in real-time."
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-pink-700" />,
            title: "3. Book & Celebrate",
            description: "Secure your date through Eventsora and celebrate your event stress-free."
        }
    ]

    return (
        <section className="xl:px-16 lg:px-10 md:px-6 px-6 py-20 bg-pink-50/50 mt-16">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className={`lg:text-5xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>
                        How Eventsora Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Plan your perfect event in three simple steps. We make it effortless to find and book the best vendors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-pink-200 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-pink-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>
                            <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${playfair.className}`}>
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
