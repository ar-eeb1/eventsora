import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { searchMasterData } from '@/lib/search'

const options = {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3
}

const SearchModel = ({ open, setOpen }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])

    const fuse = new Fuse(searchMasterData, options)
    useEffect(() => {
        if (query.trim() === '') {
            setResults([])
        }
        const res = fuse.search(query)
        setResults(res.map((r) => r.item))
    }, [query])


    return (
        <div>
            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quick Search</DialogTitle>
                        <DialogDescription>
                            Find and navigate to any action instantly, Type a keyword
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />

                    <ul className='mt-4 max-h-60 overflow-y-auto'>
                        {results.map((item, index) => (
                            <li key={index}>
                                <Link href={item.url} className='block py-2 pl-3 rounded-2xl hover:bg-muted' onClick={() => setOpen(!open)}>
                                    <h4 className='font-medium'>
                                        {item.label}
                                    </h4>
                                    <p className='text-sm text-muted-foreground'>{item.description}</p>
                                </Link>
                            </li>
                        ))}
                        {query && results.length === 0 &&
                            <div>
                                No results found
                            </div>
                        }
                    </ul>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SearchModel
