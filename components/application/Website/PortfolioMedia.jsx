'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { CardContent } from '@/components/ui/card'
import ButtonLoading from '@/components/application/ButtonLoading'
import img from '@/public/assets/img-placeholder.png'

const PortfolioMedia = ({ userId }) => {
    const [media, setMedia] = useState([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)


    const fetchMedia = async (p) => {
        setLoading(true)
        try {
            const { data } = await axios.get(`/api/media?userId=${userId}&page=${p}&limit=10&deleteType=SD`)
            if (p === 0) {
                setMedia(data.mediaData)
            } else {
                setMedia(prev => [...prev, ...data.mediaData])
            }
            setHasMore(data.hasMore)
        } catch (error) {
            console.error('Failed to fetch media:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchMedia(0)
        }
    }, [userId])

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchMedia(nextPage)
    }

    if (loading && page === 0) {
        return <div className="text-center py-10 text-gray-500">Loading portfolio...</div>
    }

    if (media.length === 0 && !loading) {
        return <div className="text-center py-10 text-gray-500">No portfolio media found.</div>
    }

    return (
        <CardContent className="p-0 mt-4">

            {/* Masonry Container */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {media.map((item, index) => (
                    <div
                        key={item._id}
                        className="break-inside-avoid relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                        <Image
                            src={item.secure_url || img.src}
                            alt={item.alt || 'Portfolio Media'}
                            width={600}
                            height={800}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={index === 0}
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-10">
                    <ButtonLoading
                        text="Show More"
                        loading={loading}
                        onClick={handleLoadMore}
                        className="rounded-full px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
                    />
                </div>
            )}
        </CardContent>
    )
}

export default PortfolioMedia

// 'use client'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import Image from 'next/image'
// import { CardContent } from '@/components/ui/card'
// import ButtonLoading from '@/components/application/ButtonLoading'
// import img from '@/public/assets/img-placeholder.png'

// const PortfolioMedia = ({ userId }) => {
//     const [media, setMedia] = useState([])
//     const [page, setPage] = useState(0)
//     const [hasMore, setHasMore] = useState(false)
//     const [loading, setLoading] = useState(false)

//     const fetchMedia = async (p) => {
//         setLoading(true)
//         try {
//             const { data } = await axios.get(`/api/media?userId=${userId}&page=${p}&limit=10&deleteType=SD`)
//             if (p === 0) {
//                 setMedia(data.mediaData)
//             } else {
//                 setMedia(prev => [...prev, ...data.mediaData])
//             }
//             setHasMore(data.hasMore)
//         } catch (error) {
//             console.error('Failed to fetch media:', error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         if (userId) fetchMedia(0)
//     }, [userId])

//     const handleLoadMore = () => {
//         const nextPage = page + 1
//         setPage(nextPage)
//         fetchMedia(nextPage)
//     }

//     // Distribute items into columns for masonry layout
//     const getColumns = (items, count) => {
//         const cols = Array.from({ length: count }, () => [])
//         items.forEach((item, i) => cols[i % count].push(item))
//         return cols
//     }

//     if (loading && page === 0) {
//         return <div className="text-center py-10 text-gray-500">Loading portfolio...</div>
//     }

//     if (media.length === 0 && !loading) {
//         return <div className="text-center py-10 text-gray-500">No portfolio media found.</div>
//     }

//     const columns2 = getColumns(media, 2)
//     const columns3 = getColumns(media, 3)

//     const renderTile = (item, index) => (
//         <div
//             key={item._id}
//             className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 group cursor-pointer break-inside-avoid mb-4"
//         >
//             <Image
//                 src={item.secure_url || img.src}
//                 alt={item.alt || 'Portfolio Media'}
//                 width={600}
//                 height={800}
//                 className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
//                 priority={index === 0}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>
//     )

//     return (
//         <CardContent className="p-0 mt-4">
//             {/* Mobile: 2 columns */}
//             <div className="columns-2 gap-3 sm:hidden">
//                 {media.map((item, i) => renderTile(item, i))}
//             </div>

//             {/* Tablet: 2 columns */}
//             <div className="hidden sm:flex lg:hidden gap-3">
//                 {columns2.map((col, ci) => (
//                     <div key={ci} className="flex-1 flex flex-col gap-3">
//                         {col.map((item, i) => renderTile(item, i))}
//                     </div>
//                 ))}
//             </div>

//             {/* Desktop: 3 columns */}
//             <div className="hidden lg:flex gap-3">
//                 {columns3.map((col, ci) => (
//                     <div key={ci} className="flex-1 flex flex-col gap-3">
//                         {col.map((item, i) => renderTile(item, i))}
//                     </div>
//                 ))}
//             </div>

//             {hasMore && (
//                 <div className="flex justify-center mt-10">
//                     <ButtonLoading
//                         text="Show More"
//                         loading={loading}
//                         onClick={handleLoadMore}
//                         className="rounded-full px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
//                     />
//                 </div>
//             )}
//         </CardContent>
//     )
// }

// export default PortfolioMedia