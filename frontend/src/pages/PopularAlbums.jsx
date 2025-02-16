import React, { useState, useEffect } from 'react'
import AlbumCard from '../components/AlbumCard'

const PopularAlbums = () => {
    const [popularAlbums, setPopularAlbums] = useState(null)

    useEffect(() => {
        const getPopularAlbums = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/popular_albums`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setPopularAlbums(data.popular_albums)
            }
        }
        getPopularAlbums()
    }, [])

    
    return (
        <div className='bg-primary px-5 pb-16 md:pb-2 h-fit w-full pt-3 md:pt-0 md:rounded-b-md'>
            <div className='text-2xl text-white font-bold mb-2'>Popular albums</div>
            <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                {popularAlbums && 
                    popularAlbums.map((album, index) => {
                        return <AlbumCard key={index} name={album.name} artist={album.artist} image={album.image} id={album.id}/>
                    })
                }
            </div>
        </div>
    )
}

export default PopularAlbums