import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import SearchModel from './SearchModel'

const AdminMobileSearch = () => {
    const [open, setOpen] = useState(false)
    return (

        <div>
            <Button type="button" size="icon" onClick={() => setOpen(!open)} className='md:hidden block' variant='ghost'>
                <Search />
            </Button>
            <SearchModel open={open} setOpen={setOpen} />
        </div>
    )
}

export default AdminMobileSearch
