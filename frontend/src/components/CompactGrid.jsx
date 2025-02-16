import React from 'react'
import { Link } from 'react-router-dom'
import formatDuration from '../utils/formatDuration.js';
import formatDate from '../utils/formatDate.js';

const CompactGrid = ({ playlistTracks, offset }) => {
    
    const cutString = (str) => {
        if(str.length >= 25){
            return str.substring(0, 24) + '...'
        } else {
            return str
        }
    }
    
    return (
        <>
            {/*Grid with 3 columns */}
            <div className='grid compact-grid xl:hidden 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistTracks.map((track, index) => {
                    if(track.track.id && track.track.type){
                        return (
                            <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                {/* Title */}
                                <div className='flex items-center text-left grid-cell font-white'>
                                    {track.track.name}
                                </div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                            </Link>
                        )
                    }
                })}
            </div>

            {/*Grid with 5 columns */}
            <div className='hidden xl:grid compact-grid 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Artist</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistTracks.map((track, index) => {
                    if(track.track.id && track.track.type){
                        return (
                            <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                {/* Title */}
                                <div className='flex items-center text-left grid-cell font-white'>
                                    {track.track.name}
                                </div>

                                {/* Artist */}
                                <div className='flex items-center text-left text-grayText grid-cell'>
                                    {cutString(track.track.artists[0].name)}
                                </div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{cutString(track.track.album.name)}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                            </Link>
                        )
                    }
                })}
            </div>

            {/*Grid with 6 columns */}
            <div className='hidden 2xl:grid compact-grid'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Artist</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="text-left border-b-2 border-hoverGray">Date added</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistTracks.map((track, index) => {
                    if(track.track.id && track.track.type){
                        return (
                            <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                {/* Title */}
                                <div className='flex items-center text-left grid-cell font-white'>
                                    {track.track.name}
                                </div>

                                {/* Artist */}
                                <div className='flex items-center text-left text-grayText grid-cell'>
                                    {cutString(track.track.artists[0].name)}
                                </div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{cutString(track.track.album.name)}</div>

                                {/* Date added */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{formatDate(track.added_at)}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                            </Link>
                        )
                    }
                })}
            </div>
        </>
    )
}

export default CompactGrid