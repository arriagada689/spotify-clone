import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import likedSongsImage from '../assets/liked-songs.png';

const LikedSongs = () => {
    const [likedSongs, setLikedSongs] = useState(null)
    const [addedOn, setAddedOn] = useState(null)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const getLikedSongsData = async () => {
                const token = JSON.parse(localStorage.getItem('userInfo')).token
                const response = await fetch(`${apiBaseUrl}/profile/liked_songs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setLikedSongs(data.liked_songs)
                    setAddedOn(data.added_on)
                }
            }
            getLikedSongsData()
        }
    }, [])
    
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {likedSongs && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={likedSongsImage} alt='Liked Songs' className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Playlist</div>
                        <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>Liked Songs</div>
                        <div className='flex space-x-3'>
                            <Link to={`/profile`} className='underline md:no-underline md:hover:underline'>{JSON.parse(localStorage.getItem('userInfo')).username}</Link>
                            <div className='text-white'>{likedSongs.length} songs</div>
                        </div>
                    </div>
                </div>
            }

            {/*Grid Section */}
            {likedSongs &&
                <div className='grid sub-grid xl:hidden 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {likedSongs.map((song, index) => {
                        return <Link to={`/track/${song.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={song.image} alt={song.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{song.name}</div>
                                            <div className='text-sm text-grayText'>{song.artist}</div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{song.duration}</div>
                                </Link>
                    })}
                </div>
            }

            {likedSongs &&
                <div className='hidden xl:grid sub-grid 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {likedSongs.map((song, index) => {
                        return <Link to={`/track/${song.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={song.image} alt={song.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{song.name}</div>
                                            <div className='text-sm text-grayText'>{song.artist}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{song.album}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{song.duration}</div>
                                </Link>
                    })}
                </div>
            }

            {likedSongs &&
                <div className='hidden 2xl:grid sub-grid'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="text-left border-b-2 border-hoverGray">Date added</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {likedSongs.map((song, index) => {
                        return <Link to={`/track/${song.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={song.image} alt={song.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{song.name}</div>
                                            <div className='text-sm text-grayText'>{song.artist}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{song.album}</div>

                                    {/* Date added */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{addedOn[index]}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{song.duration}</div>
                                </Link>
                    })}
                </div>
            }

        </div>
    )
}

export default LikedSongs