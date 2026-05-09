'use client'
import React, { useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Search, TrendingUp, AlertCircle, BarChart2 } from 'lucide-react'

const DAYS_OPTIONS = [7, 14, 30, 90]

const SearchAnalyticsPage = () => {
    const [days, setDays] = useState(30)
    const { data, loading } = useFetch(`/api/admin/searches?days=${days}`)
    const analytics = data?.data

    return (
        <div className='pt-5'>
            {/* Header */}
            <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Search Analytics</h1>
                    <p className='text-gray-500 text-sm mt-1'>See what visitors are searching for on your website</p>
                </div>
                {/* Date Range Filter */}
                <div className='flex gap-2'>
                    {DAYS_OPTIONS.map(d => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${days === d
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'bg-white dark:bg-card border-gray-200 dark:border-gray-700 hover:border-pink-300'
                                }`}
                        >
                            Last {d} days
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Card */}
            <div className='grid sm:grid-cols-3 grid-cols-1 gap-5 mb-8'>
                <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-pink-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-pink-800'>
                    <div>
                        <h4 className='font-medium text-gray-500 text-sm'>Total Searches</h4>
                        <span className='text-2xl font-bold'>{loading ? '...' : (analytics?.totalSearches ?? 0)}</span>
                    </div>
                    <span className='w-12 h-12 flex justify-center items-center rounded-full bg-pink-500 text-white'>
                        <Search size={20} />
                    </span>
                </div>
                <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-blue-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-blue-800'>
                    <div>
                        <h4 className='font-medium text-gray-500 text-sm'>Unique Terms</h4>
                        <span className='text-2xl font-bold'>{loading ? '...' : (analytics?.topSearches?.length ?? 0)}</span>
                    </div>
                    <span className='w-12 h-12 flex justify-center items-center rounded-full bg-blue-500 text-white'>
                        <TrendingUp size={20} />
                    </span>
                </div>
                <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-orange-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-orange-800'>
                    <div>
                        <h4 className='font-medium text-gray-500 text-sm'>Zero-Result Searches</h4>
                        <span className='text-2xl font-bold'>{loading ? '...' : (analytics?.zeroResults?.length ?? 0)}</span>
                    </div>
                    <span className='w-12 h-12 flex justify-center items-center rounded-full bg-orange-500 text-white'>
                        <AlertCircle size={20} />
                    </span>
                </div>
            </div>

            <div className='grid lg:grid-cols-2 grid-cols-1 gap-6'>
                {/* Top Searched Keywords */}
                <Card className='rounded p-0'>
                    <CardHeader className='py-3 border-b'>
                        <div className='flex items-center gap-2'>
                            <TrendingUp size={18} className='text-pink-500' />
                            <span className='font-semibold'>Top Searched Keywords</span>
                        </div>
                    </CardHeader>
                    <CardContent className='p-0'>
                        {loading ? (
                            <div className='p-8 text-center text-gray-400'>Loading...</div>
                        ) : analytics?.topSearches?.length === 0 ? (
                            <div className='p-8 text-center text-gray-400'>No searches recorded yet.</div>
                        ) : (
                            <div className='divide-y dark:divide-gray-800'>
                                {analytics?.topSearches?.map((item, i) => (
                                    <div key={i} className='flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                                        <div className='flex items-center gap-3'>
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-pink-300'}`}>
                                                {i + 1}
                                            </span>
                                            <div>
                                                <p className='font-medium capitalize'>{item.query}</p>
                                                <p className='text-xs text-gray-400'>{item.avgResults} results avg · last {new Date(item.lastSearched).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <span className='inline-block bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 font-semibold text-sm px-3 py-1 rounded-full'>
                                                {item.count}x
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Zero-Result Searches */}
                <Card className='rounded p-0'>
                    <CardHeader className='py-3 border-b'>
                        <div className='flex items-center gap-2'>
                            <AlertCircle size={18} className='text-orange-500' />
                            <span className='font-semibold'>No Results Found (Add listings for these!)</span>
                        </div>
                    </CardHeader>
                    <CardContent className='p-0'>
                        {loading ? (
                            <div className='p-8 text-center text-gray-400'>Loading...</div>
                        ) : analytics?.zeroResults?.length === 0 ? (
                            <div className='p-8 text-center text-gray-400'>
                                🎉 All searches are finding results!
                            </div>
                        ) : (
                            <div className='divide-y dark:divide-gray-800'>
                                {analytics?.zeroResults?.map((item, i) => (
                                    <div key={i} className='flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                                        <div className='flex items-center gap-3'>
                                            <span className='w-7 h-7 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900'>
                                                <AlertCircle size={14} className='text-orange-500' />
                                            </span>
                                            <div>
                                                <p className='font-medium capitalize'>{item.query}</p>
                                                <p className='text-xs text-gray-400'>Last searched: {new Date(item.lastSearched).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className='inline-block bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-semibold text-sm px-3 py-1 rounded-full'>
                                            {item.count}x
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Daily Volume Table */}
            {analytics?.dailyVolume?.length > 0 && (
                <Card className='rounded p-0 mt-6'>
                    <CardHeader className='py-3 border-b'>
                        <div className='flex items-center gap-2'>
                            <BarChart2 size={18} className='text-blue-500' />
                            <span className='font-semibold'>Daily Search Volume</span>
                        </div>
                    </CardHeader>
                    <CardContent className='overflow-x-auto p-0'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b bg-gray-50 dark:bg-gray-800/50'>
                                    <th className='text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300'>Date</th>
                                    <th className='text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300'>Searches</th>
                                    <th className='px-5 py-3'></th>
                                </tr>
                            </thead>
                            <tbody className='divide-y dark:divide-gray-800'>
                                {[...analytics.dailyVolume].reverse().map((row, i) => {
                                    const maxCount = Math.max(...analytics.dailyVolume.map(r => r.count))
                                    const pct = Math.round((row.count / maxCount) * 100)
                                    return (
                                        <tr key={i} className='hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors'>
                                            <td className='px-5 py-3 text-gray-700 dark:text-gray-300'>{row.date}</td>
                                            <td className='px-5 py-3 font-semibold'>{row.count}</td>
                                            <td className='px-5 py-3 w-1/2'>
                                                <div className='bg-gray-100 dark:bg-gray-800 rounded-full h-2'>
                                                    <div
                                                        className='bg-pink-400 h-2 rounded-full transition-all'
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default SearchAnalyticsPage
