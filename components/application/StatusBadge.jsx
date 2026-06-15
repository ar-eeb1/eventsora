import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const StatusBadge = ({ status, type = 'booking', className }) => {
    const s = status?.toLowerCase()

    const getBookingStyles = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500 hover:bg-green-600 text-white'
            case 'pending':
                return 'bg-yellow-400 hover:bg-yellow-500 text-black'
            case 'awaiting-payment':
                return 'bg-blue-500 hover:bg-blue-600 text-white'
            case 'completed':
                return 'bg-emerald-600 hover:bg-emerald-700 text-white'
            case 'cancelled':
                return 'bg-red-500 hover:bg-red-600 text-white'
            case 'unverified':
                return 'border-orange-500 text-orange-500 variant-outline'
            default:
                return 'variant-outline'
        }
    }

    const getPaymentStyles = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500 hover:bg-green-600 text-white'
            case 'pending':
                return 'bg-yellow-400 hover:bg-yellow-500 text-black'
            case 'partially-paid':
                return 'bg-blue-500 hover:bg-blue-600 text-white'
            case 'cancelled':
                return 'bg-red-500 hover:bg-red-600 text-white'
            case 'unverified':
                return 'border-orange-500 text-orange-500 variant-outline'
            case 'refunded':
                return 'bg-gray-500 hover:bg-gray-600 text-white'
            default:
                return 'variant-outline'
        }
    }

    const styles = type === 'payment' ? getPaymentStyles(s) : getBookingStyles(s)
    const isOutline = styles.includes('variant-outline')
    const variant = isOutline ? 'outline' : 'default'
    const finalStyles = styles.replace('variant-outline', '').trim()

    return (
        <Badge
            variant={variant}
            className={cn("capitalize font-medium shadow-sm", finalStyles, className)}
        >
            {status}
        </Badge>
    )
}

export default StatusBadge
