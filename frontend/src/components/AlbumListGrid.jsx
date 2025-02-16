import React from 'react'
import { Link } from 'react-router-dom'
import formatDuration from '../utils/formatDuration'

const AlbumListGrid = ({ album }) => {
    return (
        <div className="album-grid">
            <div className='grid-row text-grayText font-semibold'>
                <div className="text-center  border-b-2 border-hoverGray">#</div>
                <div className="text-left border-b-2 border-hoverGray">Title</div>
                <div className="mx-auto border-b-2 border-hoverGray w-full text-center">Duration</div>
            </div>

            {album.tracks.items.map((track, index) => {
                return (
                    <Link to={`/track/${track.id}`} key={index} className='grid-row parent'>
                        {/* Counter */}
                        <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>

                        {/* Title and Artist */}
                        <div className=' grid-cell text-left'>
                            <div className='text-white'>{track.name}</div>
                            <div className='text-sm text-grayText'>{track.artists[0].name}</div>
                        </div>

                        {/* Duration */}
                        <div className='flex items-center justify-center text-grayText grid-cell'>{formatDuration(track.duration_ms)}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default AlbumListGrid