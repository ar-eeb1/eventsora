import React from 'react'

const Loading = () => {
    return (
        <div className='w-screen h-screen absolute flex items-center justify-center'>
            <lord-icon
                src="https://cdn.lordicon.com/wpequvda.json"
                trigger="loop"
                delay="700"
                colors="primary:#ee66aa"
                style={{ width: 150, height: 150 }}>
            </lord-icon>
        </div>
    )
}

export default Loading
