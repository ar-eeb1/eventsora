'use client'
import React, { useState } from 'react'
import { ListItemIcon, MenuItem } from '@mui/material'
import { Landmark } from 'lucide-react'
import ReceivePaymentModal from './ReceivePaymentModal'

const ReceivePaymentAction = ({ booking, onSuccess }) => {
  const [modalOpen, setModalOpen] = useState(false)

  // Calculate if already fully paid
  const remaining = (booking.totalAmount || 0) - (booking.receivedAmount || booking.advance || 0)
  const fullyPaid = remaining <= 0

  return (
    <>
      <MenuItem 
        onClick={(e) => {
          e.stopPropagation()
          if (!fullyPaid) setModalOpen(true)
        }}
        disabled={fullyPaid}
      >
        <ListItemIcon>
          <Landmark size={20} />
        </ListItemIcon>
        Receive Payment
      </MenuItem>

      {modalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
           <ReceivePaymentModal 
            booking={booking} 
            openExternal={modalOpen} 
            setOpenExternal={setModalOpen}
            onSuccess={onSuccess} 
          />
        </div>
      )}
    </>
  )
}

export default ReceivePaymentAction
