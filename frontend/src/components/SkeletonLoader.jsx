import React from 'react'

const SkeletonLoader = ({ type }) => {
    return (
        <div className='flex flex-col gap-y-1 w-[180px] md:w-[200px] bg-primary rounded-lg pt-2 animate-pulse'>
            <div className={`${type === 'artist' ? 'rounded-full' : 'rounded-md'} bg-hoverGray w-[160px] md:w-[180px] h-[160px] md:h-[180px] self-center`}></div>
            <div className='flex flex-col gap-y-2 p-2'>
                <div className='rounded-full w-full bg-hoverGray h-3'></div>
                <div className='rounded-full w-full bg-hoverGray h-3'></div>
            </div>
        </div>
    )
}

export default SkeletonLoader