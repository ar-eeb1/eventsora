'use client'

import { useEffect, useState } from 'react'

const ShopArrivalTransition = () => {
  const [arrival, setArrival] = useState(0)

  useEffect(() => {
    const handleShopArrival = () => setArrival((current) => current + 1)

    window.addEventListener('eventsora:shop-arrival', handleShopArrival)
    return () => window.removeEventListener('eventsora:shop-arrival', handleShopArrival)
  }, [])

  useEffect(() => {
    if (arrival === 0) return

    const timeout = window.setTimeout(() => setArrival(0), 2100)
    return () => window.clearTimeout(timeout)
  }, [arrival])

  if (arrival === 0) return null

  return (
    <div key={arrival} className='shop-arrival-transition' aria-hidden='true'>
      <span className='shop-arrival-transition__message'>A little something special...</span>
    </div>
  )
}

export default ShopArrivalTransition
