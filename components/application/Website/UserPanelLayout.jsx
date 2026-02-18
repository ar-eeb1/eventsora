import React from 'react'

const UserPanelLayout = ({ children }) => {
    return (
        <div className='flex lg:flex-nowrap flex-wrap gap-10 lg:-px-32 px-5 my-20 '>
            <div className='lg:w-64 w-full lg:mb-0 mb-5'>
 
            </div>

            <div className='lg:w-[calc(100%-64rem)] w-full'>
                {children}
            </div>
        </div>
    )
}

export default UserPanelLayout
