import { ArrowRight, Star } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
})

const VendorCTA = () => {
    return (
        <section className="xl:px-16 lg:px-10 md:px-6 px-6 py-20 my-20">
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl bg-gradient-to-br from-pink-900 via-[#861043] to-purple-950">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-10 items-center p-10 md:p-16 relative z-10">
                    <div className="space-y-6 text-white">
                        <div className="flex items-center gap-2 text-pink-200 text-sm font-bold uppercase tracking-widest">
                            <Star className="w-4 h-4" />
                            For Event Professionals
                        </div>
                        <h2 className={`lg:text-5xl md:text-4xl text-3xl font-bold leading-tight ${playfair.className}`}>
                            Grow Your Event Business with Eventsora
                        </h2>
                        <p className="text-pink-100 text-lg md:text-xl max-w-lg leading-relaxed">
                            Join Pakistan's premier event platform. Connect with thousands of clients actively looking for venues, caterers, decorators, and entertainment.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <Link href="/provider/listing/add" className="inline-flex items-center justify-center gap-2 bg-white text-pink-900 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-colors shadow-xl group">
                                Register as Provider
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 transition-colors">
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block relative h-full min-h-[300px]">
                        {/* We use a placeholder image structure or custom CSS illustration here */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="p-8 flex flex-col h-full justify-between opacity-80 hover:opacity-100 transition-opacity">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                                    <div className="h-4 bg-white/20 rounded-full w-3/4" />
                                    <div className="h-4 bg-white/20 rounded-full w-1/2" />
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="h-20 bg-white/10 rounded-xl" />
                                    <div className="h-20 bg-white/10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VendorCTA
