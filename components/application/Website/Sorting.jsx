import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortings } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ListFilter } from 'lucide-react'

const Sorting = ({ limit, setLimit, sorting, setSorting, mobileFilterOpen, setMobileFilterOpen }) => {
    return (
        <div className='flex justify-between items-center flex-wrap gap-2 p-4 bg-pink-50 rounded-lg'>
            <Button type='button' className='lg:hidden  ' variant='outline' onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                <ListFilter />
                Filter
            </Button>
            <ul className='flex items-center gap-4'>
                <li className=''>Show</li>
                {[30, 60, 90, 120].map(limitNumber => (
                    <li key={limitNumber}>
                        <button onClick={() => setLimit(limitNumber)} type='button' className={`cursor-pointer ${limitNumber === limit ? 'text-white text-sm w-8 h-8 flex justify-center items-center rounded-full bg-primary' : ''}`}>
                            {limitNumber}
                        </button>
                    </li>
                ))}
            </ul>

            <Select value={sorting} onValueChange={(value) => setSorting(value)}>
                <SelectTrigger className='w-45'>
                    <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                    {sortings.map(option => (
                        <SelectItem key={option.value} value={`${option.value}`}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div >
    )
}

export default Sorting
