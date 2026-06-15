'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import { Rating } from '@mui/material'
import { IoStar } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import ButtonLoading from '../ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { showToast } from '@/lib/showToast'
import { WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ReviewList from './ReviewList'
import useFetch from '@/hooks/useFetch'

const ListingReview = ({ listingId }) => {
    const auth = useSelector((store) => store.authStore.auth)

    const queryClient = useQueryClient()

    const [loading, setLoading] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('')
    const [reviewOpen, setReviewOpen] = useState(false)
    const [reviewStats, setReviewStats] = useState({
        totalReview: 0,
        averageRating: 0,
        rating: {},
        percentage: {}
    })
    const { data: reviewDetails } = useFetch(`/api/website/review/details?listingId=${listingId}`)

    useEffect(() => {
        if (reviewDetails && reviewDetails.success) {
            setReviewStats(reviewDetails.data)
        }
    }, [reviewDetails])


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href)
        }
    }, [])

    const formSchema = zSchema.pick({
        listing: true,
        userId: true,
        rating: true,
        title: true,
        review: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            listing: listingId,
            userId: auth?._id,
            rating: 0,
            title: '',
            review: '',
        },
    })

    const handleReviewSubmit = async (values) => {
        setLoading(true)
        try {
            const payload = {
                ...values,
                userId: auth?._id,
                listing: listingId,
            }

            const { data } = await axios.post('/api/website/review/create', payload)

            if (!data?.success) {
                throw new Error(data?.message || 'Something went wrong')
            }

            showToast('success', data.message)
            form.reset()
            queryClient.invalidateQueries(['listing-review'])
        } catch (error) {
            showToast('error', error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    // GET REVIEWS FOR THIS LISTING AND PAGINATION
    const fetchReview = async (pageParam) => {
        const { data: getReviewData } = await axios.get(`/api/website/review/get?listingId=${listingId}&page=${pageParam}`)
        if (!getReviewData?.success) {
            return
        }

        return getReviewData.data
    }

    // TANSTACK
    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['listing-review'],
        queryFn: async ({ pageParam }) => fetchReview(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage?.nextpage
        }
    })


    return (
        <Card className="p-4 mb-10">
            <CardHeader className="font-semibold text-2xl border-b p-0 border-pink-400">
                <h2>Rating & Reviews</h2>
            </CardHeader>

            <CardContent>
                {/* Rating summary */}
                <div className="flex justify-between flex-wrap items-center">
                    <div className="md:w-1/2 w-full md:flex gap-10 mb-5">
                        <div className="flex flex-col items-center">
                            <h4 className="text-8xl font-semibold">{reviewStats?.averageRating || 0}</h4>
                            <div className="flex gap-2 text-2xl text-yellow-500">
                                <Rating value={Number(reviewStats?.averageRating) || 0} readOnly precision={0.1} />
                            </div>
                            <p className="mt-3">({reviewStats?.totalReview || 0} Ratings & Reviews)</p>
                        </div>

                        <div className="flex-1 flex items-center">
                            <div className="w-full">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1 w-8">
                                            <p>{rating}</p>
                                            <IoStar className="text-yellow-500" />
                                        </div>
                                        <Progress value={reviewStats?.percentage?.[rating] || 0} />
                                        <span className="text-sm">{reviewStats?.rating?.[rating] || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auth CTA */}
                    <div className="md:w-1/2 w-full text-center md:text-end">
                        {!auth ? (
                            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(currentUrl)}`}>
                                    Login to Write Review
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant={reviewOpen ? "secondary" : "outline"}
                                onClick={() => setReviewOpen(!reviewOpen)}
                                className="transition-all duration-300"
                            >
                                {reviewOpen ? 'Close Review Form' : 'Write Review'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Review form */}
                {auth && reviewOpen && (
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-3">Write a Review</h2>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleReviewSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Rating
                                                    size="large"
                                                    value={field.value}
                                                    onChange={(_, value) => field.onChange(value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="my-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter title" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="my-4">
                                    <FormField
                                        control={form.control}
                                        name="review"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write your review here..."
                                                        className="h-32"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <ButtonLoading loading={loading} type="submit" text="Submit Review" />
                            </form>
                        </Form>
                    </div>
                )}


                <div className="mt-10 border-t pt-5">
                    <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReviews || 0} Reviews</h5>

                    <div className='mt-10'>
                        {data && data.pages.map(page => (
                            page.reviews.map(review => (
                                <div key={review._id} className="mb-6 border-b pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <ReviewList review={review} />
                                    </div>
                                </div>
                            ))
                        ))}

                        {hasNextPage &&
                            <ButtonLoading text="Load More Reviews" loading={isFetching} type="button" onClick={() => fetchNextPage()} />
                        }
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}

export default ListingReview
