import React from 'react'
import { Link } from 'react-router-dom'

const RecommendedTrackCard = ({ track, flag, addToPlaylist, removeFromPlaylist, recommendedTracks, setRecommendedTracks }) => {

    //update particular track flag in recommendedTracks arr
    const updateArray = (command, trackId) => {
        
            //find where the track is in the recommended tracks arr
            const index = recommendedTracks.findIndex(track => {
                return track[1].id === trackId
            })
            
            //update arr
            if (index !== -1) {
                const updatedTracks = [
                    ...recommendedTracks.slice(0, index),
                    // Update the flag directly in the track object
                    [command === 'add' ? true : false, recommendedTracks[index][1]],
                    ...recommendedTracks.slice(index + 1)
                ];
                setRecommendedTracks(updatedTracks);
            }
            
        
    }
    
    return (
        <Link to={`/track/${track.id}`} className='space-x-3'>
            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                <img src={track.album.images[0].url} alt="" className='h-[45px] w-[45px]'/>
                <div className='flex w-full justify-between ml-2 items-center'>
                    <div className='flex flex-col'>
                        <div className='text-white'>{track.name}</div>
                        <div className='text-grayText text-sm'>{track.artists[0].name}</div>
                    </div>
                    {flag ? 
                        <button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromPlaylist(track)
                            updateArray('remove', track.id)
                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Remove</button> : 
                        <button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToPlaylist(track, null)
                            updateArray('add', track.id)
                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Add</button>
                    }
                </div>
            </div>
        </Link>
    )
}

export default RecommendedTrackCard