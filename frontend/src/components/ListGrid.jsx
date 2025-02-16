import React from 'react'
import { Link } from 'react-router-dom'
import formatDuration from '../utils/formatDuration.js';
import formatDate from '../utils/formatDate.js';

const ListGrid = ({ playlistTracks, offset }) => {
    
    return (
        <>
            {/*Grid with 3 columns */}
            <div className='grid sub-grid xl:hidden 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center  border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistTracks.map((track, index) => {
                    if(track.track.id && track.track.type){
                        return (
                            <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                {/* Title and Artist */}
                                <div className='grid-cell flex items-center text-left'>
                                    <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                    <div className="flex flex-col ml-2">
                                        <div className='text-white'>{track.track.name}</div>
                                        <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                            </Link>
                        )
                    }
                })}
                
            </div>
            
            {/*Grid with 4 columns */}
            <div className='hidden xl:grid sub-grid 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistTracks.map((track, index) => {
                    if(track.track.id && track.track.type){
                        return (
                            <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                {/* Title and Artist */}
                                <div className='grid-cell flex items-center text-left'>
                                    <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                    <div className="flex flex-col ml-2">
                                        <div className='text-white'>{track.track.name}</div>
                                        <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                    </div>
                                </div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{track.track.album.name}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                            </Link>
                        )
                    }
                })}
            </div>
            
            {/*Grid with 5 columns */}
            <div className='hidden 2xl:grid sub-grid'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
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

                                {/* Title and Artist */}
                                <div className='grid-cell flex items-center text-left'>
                                    <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                    <div className="flex flex-col ml-2">
                                        <div className='text-white'>{track.track.name}</div>
                                        <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                    </div>
                                </div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{track.track.album.name}</div>

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

export default ListGrid