import React from 'react'

const layout = ({ children }) => {
    return (
        <div className='h-screen w-screen flex justify-center items-center bg-[#c5426e]/10 dark:bg-white'>
            {children}
        </div>
    )
}

export default layout
