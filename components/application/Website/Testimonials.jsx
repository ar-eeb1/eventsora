import { Star } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import React from 'react'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
})

const Testimonials = () => {
    const reviews = [
        {
            name: "Sarah & Ahmed",
            role: "Wedding Couple",
            content: "Eventsora made planning our wedding completely stress-free. We found our dream venue and the most amazing photographer within days!",
            rating: 5,
        },
        {
            name: "Zainab Ali",
            role: "Corporate Event Planner",
            content: "The ability to directly message and get quotes from multiple caterers saved me hours of work. Highly recommend this platform to all organizers.",
            rating: 5,
        },
        {
            name: "Hassan Raza",
            role: "Birthday Host",
            content: "Found the perfect entertainment for my daughter's first birthday. The booking process was secure and seamless from start to finish.",
            rating: 5,
        }
    ]

    return (
        <section className="xl:px-16 lg:px-10 md:px-6 px-6 py-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className={`lg:text-5xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Read what our happy clients have to say about their experience planning events with Eventsora.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-pink-50/30 p-8 rounded-3xl border border-pink-100/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-pink-500 text-pink-500" />
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-8 italic">
                                "{review.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-800 text-xl">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <p className="text-sm text-pink-700">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
