import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';
import formatDuration from '../utils/formatDuration.js';
import GridDropdownButton from '../components/GridDropdownButton.jsx';
import AlbumListGrid from '../components/AlbumListGrid.jsx';
import AlbumCompactGrid from '../components/AlbumCompactGrid.jsx';

const AlbumPage = () => {
    const { id } = useParams()
    const [album, setAlbum] = useState(null)
    const [totalTime, setTotalTime] = useState(null)
    const [following, setFollowing] = useState(null)
    const [gridView, setGridView] = useState('List')
    const [gridDropdown, setGridDropdown] = useState(false)
    const [albumType, setAlbumType] = useState(null)
    const { updateSidebar } = useContext(AuthContext)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getAlbumData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_album/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data.album_data);
                setAlbum(data.album_data)
                determineAlbumType(data.album_data.album_type);
                setTotalTime(data.total_time)
            }
        }
        getAlbumData()
        
    }, [id])

    useEffect(() => {
        //Check user's following status if logged in
        if(localStorage.getItem('userInfo') && album) {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/album/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    if(data.message === 'following'){
                        setFollowing(true)
                    } else {
                        setFollowing(false)
                    }
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            getFavoriteStatus()

            const addToRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/add_recently_viewed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: album.name,
                        id: album.id,
                        image: album.images[0].url,
                        artist: album.artists[0].name,
                        type: 'Album',
                        album_type: album.album_type
                    })
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                } else {
                    const error = await response.json()
                    console.log(error)
                }
            }
            addToRecentlyViewed()
        }
    }, [album])

    const handleFollowButton = async (command) => {
        if(command === 'follow') {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/follow_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: album.name,
                    id: album.id,
                    image: album.images[0].url,
                    artist: album.artists[0].name,
                    type: 'Album',
                    album_type: album.album_type
                })
            })
            if(response.ok) {
                setFollowing(true)
                updateSidebar()
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/unfollow_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: album.id,
                    type: 'Album'
                })
            })
            if(response.ok) {
                setFollowing(false)
                updateSidebar()
            } else {
                const error = await response.json()
                console.error(error)
            }
        }
    }

    const determineAlbumType = (album_type) => {
        if(album_type === 'single' || album_type === 'compilation'){
            setAlbumType('Single / EP');
        } else {
            setAlbumType('Album');
        }
    }
    
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {album && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={album.images[0].url} alt={album.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>{albumType}</div>
                        <div className='text-2xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{album.name}</div>
                        <div className="flex space-x-3 ">
                            <Link to={`/artist/${album.artists[0].id}`} className='underline md:no-underline md:hover:underline'>{album.artists[0].name}</Link>
                            <div className=''>{album.release_date.substring(0, 4)}</div>
                            <div>{album.tracks.total} songs, {totalTime}</div>
                        </div>
                    </div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            <div className='flex justify-between items-center'>
                {!localStorage.getItem('userInfo') && 
                    <div className='text-xl text-grayText font-semibold'>
                        <Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save the album to your library.
                    </div>
                }
                {localStorage.getItem('userInfo') && following && 
                    <button onClick={() => handleFollowButton('unfollow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Unfollow</button>
                }
                {localStorage.getItem('userInfo') && !following && 
                    <button onClick={() => handleFollowButton('follow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Follow</button>
                }

                {/*Grid view button with dropdown */}
                <GridDropdownButton gridDropdown={gridDropdown} gridView={gridView} setGridDropdown={setGridDropdown} setGridView={setGridView}/>
            </div>
            
            {/* List Grid */}
            {album && gridView === 'List' &&
                <AlbumListGrid album={album}/>
            }

            {/* Compact Grid */}
            {album && gridView === 'Compact' &&
                <AlbumCompactGrid album={album}/>
            }
        </div>
    )
}

export default AlbumPage