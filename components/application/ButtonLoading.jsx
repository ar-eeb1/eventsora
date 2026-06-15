import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const ButtonLoading = ({ type, text, loading, className, onClick, ...props }) => {
    return (
        <Button
            type={type}
            disabled={loading}
            className={cn('cursor-pointer', className)}
            onClick={onClick}
            {...props}>
            {loading &&
                <Loader2 className='animate-spin' />
            }
            {text}
        </Button>
    )
}

export default ButtonLoading
