import React, { useState, useEffect } from 'react'
import PlaylistCard from '../components/PlaylistCard'

const FeaturedPlaylists = () => {
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null)

    useEffect(() => {
        const getFeaturedPlaylists = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/featured_playlists`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setFeaturedPlaylists(data.featured_playlists)
            }
        }
        getFeaturedPlaylists()
    }, [])
    
    return (
        <div className={`bg-primary px-5 pb-16 md:pb-2 h-dvh w-full pt-3 md:pt-0 md:rounded-b-md`}>
            <div className='text-2xl text-white font-bold mb-2'>Featured playlists</div>
            <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                {featuredPlaylists && 
                    featuredPlaylists.map((playlist, index) => {
                        return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/>
                    })
                }
            </div>
        </div>
    )
}

export default FeaturedPlaylists