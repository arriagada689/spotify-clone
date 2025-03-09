import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import formatDuration from '../utils/formatDuration'
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaCheck } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import TrackFlexCard from '../components/TrackFlexCard.jsx';

const TrackPage = () => {
    const { id } = useParams()
    const [track, setTrack] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [albumData, setAlbumData] = useState(null)
    const [update, setUpdate] = useState(0)
    const [userList, setUserList] = useState(null)
    const [liked, setLiked] = useState(false)
    const [likedList, setLikedList] = useState(null)
    const [dropdown, setDropdown] = useState(false)
    const [flag, setFlag] = useState(false)
    const { updateSidebar } = useContext(AuthContext);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getTrackData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_track/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setTrack(data.track_data)
                setPopularTracks(data.popular_tracks)
                setAlbumData(data.album_data)
            }
        }
        getTrackData()

        if(localStorage.getItem('userInfo')) {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const checkLikeStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/like_status/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setLiked(data.liked_status)
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            checkLikeStatus()
        }
        
    }, [id])

    {/*Gets list of liked songs status for each popular track */}
    useEffect(() => {
        if(localStorage.getItem('userInfo') && popularTracks && popularTracks.length > 0){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getLikeList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/like_list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        track_list: popularTracks
                    })
                })
                if(response.ok){
                    const data = await response.json()
                    setLikedList(data)
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            getLikeList()
        }
    }, [popularTracks])

    {/*Handles recently viewed */}
    useEffect(() => {
        if(localStorage.getItem('userInfo') && track){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const addToRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/add_recently_viewed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: track.name,
                        id: track.id,
                        image: track.album.images[0].url,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        duration: track.duration_ms,
                        type: 'Track'
                    })
                })
                if(response.ok) {
                    const data = await response.json()
                    setFlag(true)
                    // console.log(data)
                } else {
                    const error = await response.json()
                    console.log(error)
                }
            }
            addToRecentlyViewed()
        }
    }, [track])

    {/*Grabs user's list of playlists */}
    useEffect(() => {
        //if logged in, grab all the user's playlists for adding to playlist functionality
        if(localStorage.getItem('userInfo') && track && flag){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getUserList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/user_list/track/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    setUserList(data.user_list)
                } else {
                    const error = await response.json()
                    console.log(error);
                }
            }
            getUserList()
        }
    }, [update, id, flag])
    

    const handlePlaylistFunctionality = async (user_playlist_id, command) => {
        //handle update state variable
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        if(command === 'add') {
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: user_playlist_id,
                    type: 'Track',
                    name: track.name,
                    id: track.id,
                    image: track.album.images[0].url,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    duration: track.duration_ms
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            const response = await fetch(`${apiBaseUrl}/profile/remove_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: user_playlist_id,
                    type: 'Track',
                    id: track.id
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                console.error(error)
            }
        }
    }

    const likeSong = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/like_song/${track.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setLiked(true)
            updateSidebar()
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const unlikeSong = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/unlike_song/${track.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setLiked(false)
            updateSidebar()
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-6'>
            {track && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={track.album.images[0].url} alt={track.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Song</div>
                        <div className='text-2xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{track.name}</div>
                        <div className='flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5'>
                            <Link to={`/artist/${track.artists[0].id}`} className='underline md:no-underline md:hover:underline'>{track.artists[0].name}</Link>
                            <Link to={`/album/${track.album.id}`} className='underline md:no-underline md:hover:underline'>{track.album.name}</Link>
                            <div>{track.album.release_date.substring(0,4)}</div>
                            <div>{formatDuration(track.duration_ms)}</div>
                        </div>
                    </div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            <div className="flex md:flex-row items-center md:space-y-0 space-x-5 lg:space-x-8">
                {!localStorage.getItem('userInfo') && <div className='text-xl text-grayText font-semibold'><Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save this song to your playlists.</div>}
                
                {/*Add to playlist section */}
                {localStorage.getItem('userInfo') && userList &&
                    <div className='relative'>
                        <button onClick={() => setDropdown(prev => !prev)} className='bg-miniHover py-2 px-3 text-xl rounded-2xl text-white hover:bg-lighterGray'>Add to playlist</button>

                        {/*Dropdown */}
                        {dropdown && 
                            <div className='absolute left-0 mt-1 flex flex-col bg-miniHover w-fit rounded-md p-1'>
                                <Link to={'/create_playlist'} className='w-full hover:bg-lighterGray text-left text-white p-2 border-b border-white text-nowrap'>Create new playlist</Link>
                                {userList.map((user_playlist, index) => {
                                    return <button 
                                            onClick={() => handlePlaylistFunctionality(user_playlist[0], user_playlist[2] ? 'remove' : 'add')} 
                                            className='w-full hover:bg-lighterGray text-left text-white p-2' 
                                            key={index}>
                                            <div className='flex items-center justify-between'>
                                                <div>{user_playlist[1]}</div>
                                                <div>{user_playlist[2] ? <FaCheck /> : ''}</div>
                                            </div>
                                            </button>
                                })}
                            </div>
                        }
                    </div>
                }

                {/*Like Song Button */}
                {track && !liked && localStorage.getItem('userInfo') &&
                    <div className="relative flex items-center justify-center group">
                        <button onClick={likeSong} className="text-grayText hover:text-white">
                            <FiPlusCircle size={40} />
                        </button>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-grayBox text-white text-sm p-1 px-2 rounded">
                            Save to Your Library
                        </span>
                    </div>
                }
                {track && liked && localStorage.getItem('userInfo') &&
                    <div className="relative flex items-center justify-center group">
                        <button onClick={unlikeSong} className='text-spotifyGreen hover:text-lightGreen'>
                            <FaCheckCircle size={40}/>
                        </button>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-grayBox text-white text-sm p-1 px-2 rounded">
                            Remove from Your Library
                        </span>
                    </div>
                }

                {/* Preview song button */}
                {track && track.preview_url && <a className='bg-spotifyGreen h-fit w-fit text-center font-semibold py-2 px-3 text-xl rounded-2xl' href={track.preview_url} target='_blank'>Preview Song</a>}
                {track && track.external_urls.spotify && <a href={`${track.external_urls.spotify}`} target='_blank' className='bg-spotifyGreen hover:bg-green-400 h-fit w-fit text-center font-semibold py-2 px-3 text-lg rounded-2xl'>Spotify Link</a>}
            </div>
            
            {/*Popular tracks section when logged in*/}
            {popularTracks && popularTracks.length > 0 && likedList && likedList.length > 0 && 
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Popular tracks by <Link to={`/artist/${track.artists[0].id}`} className='text-green-500 underline md:no-underline md:hover:underline'>{track ? track.artists[0].name : ''}</Link></div>
                    
                    <div className="flex-flex-col">
                        {popularTracks.map((popular_track, index) => {
                            if(popular_track && likedList && likedList.length > 0){
                                return <TrackFlexCard key={index} popular_track={popular_track} flag={likedList[index]} index={index}/>
                            } 
                        })}
                    </div>
                </div>
            }

            {/*Popular tracks section when not logged in*/}
            {popularTracks && popularTracks.length > 0 && !likedList &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Popular tracks by <Link to={`/artist/${track.artists[0].id}`} className='text-green-500 underline md:no-underline md:hover:underline'>{track ? track.artists[0].name : ''}</Link></div>
                    
                    <div className="flex-flex-col">
                        {popularTracks.map((popular_track, index) => {
                            if(popular_track){
                                return <TrackFlexCard key={index} popular_track={popular_track} index={index}/>
                            } 
                        })}
                    </div>
                </div>
            }
            
            {/*More from the album section */}
            {albumData && albumData.length > 0 && track &&
                
                <div>
                    <Link to={`/album/${track.album.id}`} className='flex items-center rounded-t-lg bg-hoverGray hover:bg-miniHover'>
                        <img src={track.album.images[0].url} alt={track.name} className='h-[68px] w-[68px] rounded-t-lg'/>
                        <div className='flex flex-col ml-2 text-white'>
                            <div>From the album</div>
                            <div className='text-lg font-semibold hover:underline'>{track.album.name}</div>
                        </div>
                    </Link>
                    
                    <div className='album-grid'>

                        {albumData.map((album_track, index) => {
                            if(album_track){
                                return <Link to={`/track/${album_track.id}`} key={index} className='grid-row'>
                                            {/* Counter */}
                                            <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>

                                            {/* Title and Artist */}
                                            <div className='grid-cell text-left'>
                                                <div className='text-white'>{album_track.name}</div>
                                                <div className='text-sm text-grayText'>{album_track.artists[0].name}</div>
                                            </div>

                                            {/* Duration */}
                                            <div className='flex items-center justify-center text-grayText grid-cell'>{formatDuration(album_track.duration_ms)}</div>
                                        </Link>
                            }
                        })}
                    </div>
                </div>
                
            }
        </div>
    )
}

export default TrackPage