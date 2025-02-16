import React, { useEffect, useState } from 'react'
import ArtistCard from '../components/ArtistCard'

const PopularArtists = () => {
    const [popularArtists, setPopularArtists] = useState(null)

    useEffect(() => {
        const getPopularArtists = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/popular_artists`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setPopularArtists(data.popular_artists)
            }
        }
        getPopularArtists()
    }, [])

    return (
        <div className='bg-primary px-5 pb-16 md:pb-2 w-full pt-3 md:pt-0 md:rounded-b-md'>
            <div className='text-2xl text-white font-bold mb-2'>Popular artists</div>
            <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                {popularArtists && 
                    popularArtists.map((artist, index) => {
                        return <ArtistCard key={index} name={artist.name} image={artist.image} id={artist.id}/>
                    })
                }
            </div>
        </div>
    )
}

export default PopularArtists