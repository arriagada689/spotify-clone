import React from 'react'
import formatDuration from '../utils/formatDuration'
import { Link } from 'react-router-dom'

const TrackSearchCard = ({popular_track, index}) => {
   
    return (
        <Link to={`/track/${popular_track.id}`} key={index}>
            <div className="flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md parent">
                <img
                    src={popular_track.album.images[0].url}
                    alt={popular_track.name}
                    className="h-[45px] w-[45px] rounded-md"
                />
                <div className="flex w-full justify-between ml-2 items-center">
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-white truncate max-w-[200px] md:max-w-[225px] lg:max-w-[350px] xl:max-w-[550px]">{popular_track.name}</div>
                        <div className="text-grayText text-sm truncate max-w-[200px] md:max-w-[225px] lg:max-w-[350px] xl:max-w-[550px]">{popular_track.artists[0].name}</div>
                    </div>
                    
                    <div className="flex items-center text-grayText space-x-3">
                        <div className="">{formatDuration(popular_track.duration_ms)}</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TrackSearchCard