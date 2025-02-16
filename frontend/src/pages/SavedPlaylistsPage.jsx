import React, { useEffect, useState } from 'react'
import PlaylistCard from '../components/PlaylistCard'

const SavedPlaylistsPage = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/get_sub_profile_data`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setData(data)
            }
        }
        getData()
    }, [])

    return (
        <div className={`bg-primary px-5 pb-16 md:pb-2 h-dvh w-full pt-3 md:pt-0 md:rounded-b-md`}>
            <div className='text-2xl text-white font-bold mb-2'>Saved Playlists</div>
            <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                {data &&
                    data.saved_playlists.map((item, index) => {
                        if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator} type={item.type}/>
                        } else if(item.type === 'UserPlaylist'){
                            return <PlaylistCard key={index} name={item.name} id={item._id} image={'default'} owner={item.creator} type={item.type}/>
                        }
                    })
                }
            </div>
        </div>
    )
}

export default SavedPlaylistsPage