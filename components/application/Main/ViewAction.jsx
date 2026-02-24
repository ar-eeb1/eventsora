import { ListItemIcon, MenuItem } from '@mui/material'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ViewAction = ({ href }) => {
  return (
    <MenuItem key='view'>
      <Link className='flex items-center' href={href}>
        <ListItemIcon>
          <EyeIcon />
        </ListItemIcon>
        View
      </Link>
    </MenuItem>
  )
}

export default ViewAction
