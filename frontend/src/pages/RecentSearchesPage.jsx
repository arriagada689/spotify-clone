import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AudiobookCard from '../components/AudiobookCard.jsx';
import TrackCard from '../components/TrackCard.jsx';

const RecentSearchesPage = () => {
    const [recentlyViewed, setRecentlyViewed] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/get_recently_viewed`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setRecentlyViewed(data)
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            getRecentlyViewed()
        }
    }, [])

    const handleClearClick = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/wipe_recently_viewed`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok) {
            const data = await response.json()
            navigate('/search')
        }
    }
    
    return (
        <div className={`bg-primary px-5 pb-16 md:pb-2 h-dvh w-full pt-3 md:pt-0 md:rounded-b-md`}>
            <div className='flex justify-between items-baseline mb-2'>
                <div className='text-2xl text-white font-bold mb-2'>Recent Searches</div>
                <button onClick={handleClearClick} className=' text-grayText underline md:no-underline hover:underline font-semibold'>Clear recent searches</button>
            </div>
            {recentlyViewed && 
                <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                    {recentlyViewed.map((item, index) => {
                        // console.log(item)
                        if(item.type === 'Artist'){
                            return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                        } else if(item.type === 'Album'){
                            return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                        } else if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.owner}/>
                        } else if(item.type === 'Audiobook'){
                            return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                        } else if(item.type === 'Track'){
                            return <TrackCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default RecentSearchesPage