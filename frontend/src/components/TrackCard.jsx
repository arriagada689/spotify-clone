import React from 'react'
import { Link } from 'react-router-dom'

const TrackCard = ({ name, id, image, artist }) => {
    
    return (
        <Link to={`/track/${id}`}>
            <div className='flex flex-col w-[180px] md:w-[200px] bg-primary hover:bg-hoverGray rounded-lg pt-2'>
                <img src={image} alt={name} className='rounded-md w-[160px] md:w-[180px] h-[160px] md:h-[180px] self-center' />
                <div className="flex flex-col p-2">
                    <div className='text-white truncate'>{name}</div>
                    <div className='text-grayText text-sm truncate'>{artist}</div>
                </div>
            </div>
        </Link>
    )
}

export default TrackCard