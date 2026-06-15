import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LastPage } from '@mui/icons-material'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { showToast } from '@/lib/showToast'
import ModalMediaBlock from './ModalMediaBlock'
import ButtonLoading from '../ButtonLoading'

function MediaModal({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) {

    const [previouslySelected, setPreviouslySelected] = useState([])

    // Fix: Radix UI Dialog sometimes fails to restore body scroll after closing.
    // Forcibly reset overflow whenever the dialog transitions to closed.
    useEffect(() => {
        if (!open) {
            document.body.style.overflow = ''
            document.body.style.pointerEvents = ''
        }
    }, [open])

    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=18&deleteType=SD`)
        return response
    }

    const { isPending, isError, data, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (LastPage, allPages) => {
            const nextPage = allPages.length
            return LastPage.hasMore ? nextPage : undefined
        }
    })
    const handleClear = () => {
        setSelectedMedia([])
        setPreviouslySelected([])
        showToast('success','Media Cleared')
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedMedia(previouslySelected)
    }
    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return showToast('error', 'Select media first')
        }
        setPreviouslySelected(selectedMedia)
        setOpen(false)
    }
    return (
        <Dialog
            open={open}
            onOpenChange={() => setOpen(!open)}
        >
            <DialogContent onInteractOutside={(e) => e.preventDefault()}
                className='sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none'
            >
                <DialogDescription className='hidden'></DialogDescription>

                <div className='h-[90vh] bg-white p-3 rounded shadow'>
                    <DialogHeader className='h-8 border-b'>
                        <DialogTitle>Media Selection</DialogTitle>
                    </DialogHeader>

                    <div className={`h-[calc(100%-80px)] ${isPending ? 'overflow-hidden' : 'overflow-auto'} py-2`}>
                        {isPending ?
                            (<div className='size-full flex justify-center items-center animate-spin overflow-hidden'>
                                <Image
                                    src={Loading.src}
                                    alt='loading'
                                    width={80}
                                    height={80}
                                />
                            </div>)
                            :
                            isError ?
                                <div className='size-full flex justify-center items-center'>
                                    <span className='text-red-500'>{error.message}</span>
                                </div>
                                :
                                <>
                                    <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>
                                        {
                                            data?.pages?.map((page, index) => (
                                                <React.Fragment key={index}>
                                                    {
                                                        page?.mediaData?.map((media) => (
                                                            <ModalMediaBlock
                                                                key={media._id}
                                                                media={media}
                                                                selectedMedia={selectedMedia}
                                                                setSelectedMedia={setSelectedMedia}
                                                                isMultiple={isMultiple}
                                                            />
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                    {
                                        hasNextPage &&
                                        <div className='text-center mt-5'>
                                            <ButtonLoading text='Load More' className='cursor-pointer mb-3' type='button' loading={isFetching} onClick={() => fetchNextPage()} />
                                        </div>
                                    }
                                </>
                        }
                    </div>

                    <div className='h-10 pt-3 border-t flex justify-between'>
                        <div>
                            <Button className='cursor-pointer' type='button' variant='destructive' onClick={handleClear}>Clear All</Button>
                        </div>
                        <div className='flex gap-5'>
                            <Button className='cursor-pointer' type='button' variant='secondary' onClick={handleClose}>Close</Button>
                            <Button className='cursor-pointer' type='button' onClick={handleSelect}>Select</Button>
                        </div>

                    </div>
                </div>


            </DialogContent>
        </Dialog>
    )
}

export default MediaModal
