import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import spotifyImage from '../assets/spotify_default2.jpg';
import PlaylistCard from '../components/PlaylistCard.jsx';

const UserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [userPlaylists, setUserPlaylists] = useState(null)

    const offset = searchParams.get('offset') ? searchParams.get('offset') : 0

    useEffect(() => {
        const getUserData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_user/${id}?offset=${offset}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setUser(data.user_data)
                setUserPlaylists(data.user_playlists)
            }
        }
        getUserData()
    }, [searchParams])

    const handleMore = () => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('offset', offset + 50)
        setSearchParams(newParams)
    }
    
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {user && 
                <div className='flex flex-col md:flex-row items-center'>
                    {user.images.length > 0 ? <img src={user.images[1].url} alt={user.name} className='h-[270px] w-[270px] rounded-full mx-auto md:mx-0'/> : <img src={spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-full mx-auto md:mx-0'/>}
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Profile</div>
                        <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{user.display_name}</div>
                    </div>
                </div>
            }

            {userPlaylists && userPlaylists.items.length > 0 &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Public playlists</div>
                    <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                        {userPlaylists.items.map((playlist, index) => {
                            return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/>
                        })}
                    </div>
                </div>
            }

            {userPlaylists && userPlaylists.total > offset + 50 ? 
                <div className='flex items-center justify-center'>
                    <button onClick={handleMore} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Show more</button> 
                </div>
                : null}
        </div>
    )
}

export default UserPage