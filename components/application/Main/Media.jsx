import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast'
// import { PROVIDER_MEDIA_EDIT } from '@/routes/ProviderPanelRoute'
import { EllipsisVertical, Link2Icon, Pencil, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }) => {

    const handleCheck = () => {
        let newSelectedMedia = []
        if (selectedMedia.includes(media._id)) {
            newSelectedMedia = selectedMedia.filter(m => m !== m._id)
        } else {
            newSelectedMedia = [...selectedMedia, media._id]
        }
        setSelectedMedia(newSelectedMedia)
    }

    const handleCopyLink = async (url) => {
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link Copied')
    }
    return (
        <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
            <div className="absolute top-2 left-2 z-20">
                <Checkbox
                    className='cursor-pointer border-primary'
                    checked={selectedMedia.includes(media._id)}
                    onCheckedChange={handleCheck}
                />
            </div>

            <div className='absolute top-2 right-2 z-20 '>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-white/90 dark:bg-white cursor-pointer'>
                            <EllipsisVertical
                                size={25}
                                className='text-black rounded-full cursor-pointer p-1'
                            />
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {deleteType === 'SD' &&
                            <>
                                {/* <DropdownMenuItem asChild className='cursor-pointer'>
                                    <Link href={PROVIDER_MEDIA_EDIT(media._id)}>
                                        <Pencil />
                                        Edit
                                    </Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem className='cursor-pointer' onClick={() => handleCopyLink(media.secure_url)}>
                                    <Link2Icon />
                                    Copy Link
                                </DropdownMenuItem>
                            </>
                        }
                        <DropdownMenuItem className='bg-red-500 text-white cursor-pointer' onClick={() => handleDelete([media._id], deleteType)}>
                            <Trash className='' />
                            {deleteType === 'SD' ? 'Move into Trash' : 'Delete Permanently'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='w-full cursor-pointer h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30'></div>

            <div>
                <Image
                    src={media?.secure_url}
                    alt={media?.alt || 'Image'}
                    width={300}
                    height={300}
                    className='object-cover w-full sm:h-[250px] h-[150px]'
                />
            </div>
        </div>
    )
}


export default Media
