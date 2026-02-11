import Image from 'next/image'
import React from 'react'
import profileIcon from '@/public/assets/profile.png'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoStar } from 'react-icons/io5'
dayjs.extend(relativeTime)

const ReviewList = ({ review }) => {
    return (
        <div className='flex gap-5 w-full'>
            <div className="w-15">
                <Image src={review?.user?.avatar || profileIcon.src} width={60} height={60} className="rounded-full" alt='user profile pic' />
            </div>
            <div className="w-[calc(100%-100px)] ">
                <div className=''>
                    <div className='flex gap-1 mb-1'>
                        {[...Array(5)].map((_, i) => (
                            <IoStar
                                key={i}
                                className={i < review?.rating ? 'text-yellow-500' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <h4 className='text-xl font-semibold'>{review?.title}</h4>
                    <p className='flex gap-2 items-center '>
                        <span className='font-medium '>{review?.reviewedBy}</span>
                        -
                        <span className='text-gray-500 text-xs'>{dayjs(review?.createdAt).fromNow()}</span>
                    </p>
                    <p className='text-gray-700'>{review?.review}</p>
                </div>
            </div>
        </div >
    )
}

export default ReviewList
