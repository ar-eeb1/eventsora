'use client'
import React from 'react'
import CountOverview from './CountOverview'
import { useSelector } from 'react-redux'
import SellerCountOverview from './SellerCountOverview'

const ProviderDashboard = () => {
  const currentMode = useSelector(state => state.authStore.mode) || 'provider'

  const dashboardContent = (
    <div className=''>
      <div className="space-y-8 mt-4">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
              {currentMode === 'seller' ? 'Seller Overview' : 'Count Overview'}
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>
          {currentMode === 'seller' ? <SellerCountOverview /> : <CountOverview />}
        </section>
      </div>
    </div>
  )

  return dashboardContent
}

export default ProviderDashboard
