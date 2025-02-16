import React, { useState, useEffect } from 'react'
import AlbumCard from '../components/AlbumCard'
import sortAlbumsByReleaseDate from '../utils/sortAlbums'

const NewReleasesPage = () => {
    const [newReleases, setNewReleases] = useState(null)

    useEffect(() => {
        const getNewReleases = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/new_releases`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                const sortedNewReleases = sortAlbumsByReleaseDate(data.new_releases);
                setNewReleases(sortedNewReleases);
                // console.log(data.new_releases);
            }
        }
        getNewReleases()
    }, [])
    
    return (
        <div className={`bg-primary px-5 pb-16 md:pb-2 h-dvh w-full pt-3 md:pt-0 md:rounded-b-md`}>
            <div className='text-2xl text-white font-bold mb-2'>New Releases</div>
            <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                {newReleases && 
                    newReleases.map((album, index) => {
                        return <AlbumCard key={index} name={album.name} artist={album.artists[0].name} image={album.images[0].url} id={album.id}/>
                    })
                }
            </div>
        </div>
    )
}

export default NewReleasesPage