import { Delete } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem key='delete' onClick={() => handleDelete([row.original._id], deleteType)}>
      <ListItemIcon>
        <Delete />
      </ListItemIcon>
      Delete
    </MenuItem>
  )
}

export default DeleteAction
