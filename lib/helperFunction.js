import { NextResponse } from "next/server"

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success, statusCode, message, data
    })
}

export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const catchError = (error, customMessage) => {
    // handling error
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(',')
        error.message = `Duplicate Fields ${keys}. This fields value must be unique.`
    }
    let errorObj = {}
    if (process.env.NODE_ENV === 'development') {
        errorObj = {
            message: error.message,
            error
        }
    } else {
        errorObj = {
            message: customMessage || 'Internal Server error.',
        }
    }
    return NextResponse.json({
        success: false,
        statusCode: error.code,
        ...errorObj
    })
}

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}




export const columnConfig = (column, isCreatedAt = false, isUpdatedAt = false, isDeletedAt = false) => {
    const newColumn = [...column]

    if (isCreatedAt) {
        newColumn.push(
            {
                accessorKey: 'createdAt',
                header: 'Created Name',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            }
        )
    }
    if (isUpdatedAt) {
        newColumn.push(
            {
                accessorKey: 'updatedAt',
                header: 'Updated Name',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            }
        )
    }
    if (isDeletedAt) {
        newColumn.push(
            {
                accessorKey: 'deletedAt',
                header: 'Deleted Date',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            }
        )
    }

    return newColumn
}