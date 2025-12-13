'use client'
import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes' // Import the logic hook

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const [isDark, setIsDark] = useState(false)
    useEffect(() => {

        if (theme === 'dark') {
            setIsDark(true)
        } else if (theme === 'light') {
            setIsDark(false)
        } else if (theme === 'system') {
            // For 'system', check the actual system preference for accurate UI display
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDark(prefersDark)
        }
    }, [theme]) // Re-run whenever the theme changes

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark'
        setTheme(newTheme)
        
    }


    return (
        <button
            onClick={toggleTheme}
            className='lg:mr-10 relative inline-flex h-8 w-15 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gray-200 dark:bg-gray-700'
            role='switch'
            aria-checked={isDark}
            aria-label='Toggle theme'
        >
            {/* Toggle Circle */}
            <span
                className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ${isDark ? 'translate-x-8' : 'translate-x-1'
                    }`}
            >
                {isDark ? (
                    <Moon className='h-3 w-3 text-blue-500' />
                ) : (
                    <Sun className='h-3 w-3 text-yellow-500' />
                )}
            </span>
        </button>
    )
}

export default ThemeSwitch