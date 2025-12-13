import { Edit } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const EditAction = ({ href }) => {
  return (
    <MenuItem key='edit' onClick={() => handleEdit()}>
      <Link href={href}>
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  )
}

export default EditAction
