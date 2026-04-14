import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const metadata = {
    title: 'Not Found',
    description: 'Page does not exist or not found'
}

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-200 px-6 text-center">
            <Image 
            src='/assets/eventsora.png'
            width={400}
            height={400}
            alt='eventsora'
            />
            <h1 className="text-4xl font-extrabold text-pink-800 mb-4">
                404
            </h1>

            {/* Message */}
            <h2 className="text-2xl font-semibold text-pink-700 mb-2">
                Page Not Found
            </h2>

            <p className="text-pink-500 max-w-md mb-6">
                The page you are looking for doesn&quot;t exist or has been moved.
                Let&quot;s get you back on track.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-pink-800 transition"
                >
                    Go Home
                </Link>

            </div>

            {/* Optional Illustration */}
            <div className="mt-10 text-pink-400 text-sm">
                Eventsora &copy; {new Date().getFullYear()}
            </div>
        </div>
    )
}

export default NotFound