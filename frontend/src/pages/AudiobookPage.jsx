import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import AudiobookDescription from '../components/AudiobookDescription'
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaCheck } from "react-icons/fa";

const AudiobookPage = () => {
    const { id } = useParams()
    const [audiobook, setAudiobook] = useState(null)
    const [duration, setDuration] = useState(null)
    const [following, setFollowing] = useState(null)
    const [update, setUpdate] = useState(0)
    const [userList, setUserList] = useState(null)
    const [dropdown, setDropdown] = useState(false)
    const { updateSidebar } = useContext(AuthContext)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getAudiobookData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_audiobook/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setAudiobook(data.audiobook_data)
                setDuration(data.duration)
            }
        }
        getAudiobookData()

    }, [id])

    useEffect(() => {
        //if logged in, grab all the user's playlists for adding to playlist functionality
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getUserList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/user_list/audiobook/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    setUserList(data.user_list)
                }
            }
            getUserList()
        }
    }, [update])

    useEffect(() => {
        //Check user's following status if logged in
        if(localStorage.getItem('userInfo') && audiobook){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/audiobook/${id}`, {
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
                        name: audiobook.name,
                        id: audiobook.id,
                        image: audiobook.images[0].url,
                        author: audiobook.authors[0].name,
                        duration: duration,
                        type: 'Audiobook'
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
    }, [audiobook])

    const handleFollowButton = async (command) => {
        if(command === 'follow'){
            //set up fetch to follow item endpoint
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/follow_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: audiobook.name,
                    id: audiobook.id,
                    image: audiobook.images[0].url,
                    author: audiobook.authors[0].name,
                    duration: duration,
                    type: 'Audiobook'
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
            //set up fetch to unfollow item endpoint
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/unfollow_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: audiobook.id,
                    type: 'Audiobook'
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
                    type: 'Audiobook',
                    name: audiobook.name,
                    id: audiobook.id,
                    image: audiobook.images[0].url,
                    author: audiobook.authors[0].name,
                    duration: duration
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
                    type: 'Audiobook',
                    id: audiobook.id
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
    
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {audiobook && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={audiobook.images[0].url} alt={audiobook.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Audiobook</div>
                        <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{audiobook.name}</div>
                        <div className='text-grayText'>{audiobook.authors[0].name}</div>
                    </div>
                </div>
            }

            {/* Conditional for CRUD */}
            <div className="flex items-center space-x-3 md:space-x-5">
                {!localStorage.getItem('userInfo') && <div className='text-xl text-grayText font-semibold'><Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save the song to your playlists.</div>}
                
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

                {/*Follow/unfollow button */}
                {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Unfollow</button>}
                {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Follow</button>}
            </div>

            {audiobook && 
                <div className='text-grayText'>
                    <div >
                        Narrated by 
                        {audiobook.narrators.map((narrator, index) => {
                            return <div key={index} className='text-white'>{narrator.name}</div>
                        })}
                    </div>

                    <div>Description:</div>
                    <AudiobookDescription description={audiobook.description}/>
                </div>
            }

        </div>
    )
}

export default AudiobookPage