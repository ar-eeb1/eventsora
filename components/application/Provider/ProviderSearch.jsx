'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import SearchModel from './SearchModel'

const ProviderSearch = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className='md:w-[350px] '>
            <div className='relative flex justify-between items-center '>
                <Input
                    readOnly
                    className='rounded-full'
                    placeholder='Search...'
                    onClick={() => setOpen(true)}
                />
                <button type='button' className='absolute right-3  cursor-default'>
                    <Search size={15} />
                </button>
            </div>
            <SearchModel open={open} setOpen={setOpen} />
        </div>
    )
}

export default ProviderSearch
