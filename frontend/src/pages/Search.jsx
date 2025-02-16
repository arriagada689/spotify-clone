import React, { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard.jsx'
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard.jsx';
import { FaSearch } from "react-icons/fa";
import AlbumCard from '../components/AlbumCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AudiobookCard from '../components/AudiobookCard.jsx';
import { Oval } from 'react-loader-spinner'
import staticCategories from '../utils/categories.js';
import TrackCard from '../components/TrackCard.jsx';
// import TrackFlexCard from '../components/TrackFlexCard.jsx';
import TrackSearchCard from '../components/TrackSearchCard.jsx';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query')
    const type = searchParams.get('type')
    const offset = Number(searchParams.get('offset')) || 0;
    const navigate = useNavigate();

    const [categories, setCategories] = useState(!query ? staticCategories : null)
    const [input, setInput] = useState('')
    const [update, setUpdate] = useState(0)
    const [recentlyViewed, setRecentlyViewed] = useState(null)
    const [awake, setAwake] = useState(false)
    const [isInputFocused, setInputFocused] = useState(false);

    const [trackData, setTrackData] = useState(null)
    const [artistData, setArtistData] = useState(null)
    const [albumData, setAlbumData] = useState(null)
    const [playlistData, setPlaylistData] = useState(null)
    const [audiobookData, setAudiobookData] = useState(null)

    const [likedList, setLikedList] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    
    useEffect(() => {

        const searchRequest = async () => {
            if(query) {
                let url = `${import.meta.env.VITE_API_BASE_URL}/spotify/search`;
                
                //attach query params
                if(query && type && offset){
                    url += `?query=${query}&type=${type}&offset=${offset}`
                }
                else if(query && type){
                    url += `?query=${query}&type=${type}`
                }
                else if(query) {
                    url += `?query=${query}`
                }

                const response = await fetch(url, {
                    headers: { 
                        'Content-Type': 'application/json' 
                    }
                })
                if(response.ok) {
                    const data = await response.json();
                    // console.log(data.tracks)
                    
                    setCategories(null);
                    setArtistData(data.artists);
                    setAlbumData(data.albums);
                    setTrackData(data.tracks);
                    setPlaylistData(data.playlists);
                    setAudiobookData(data.audiobooks);
                }
            } else {
                setCategories(staticCategories)
            }
        }
        searchRequest()
    }, [query, update])

    useEffect(() => {
        //Check if server is awake
        const awakeStatus = async () => {
            const response = await fetch(`${apiBaseUrl}/users/awake`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = await response.json()
                setAwake(data.status)
            }
        }
        awakeStatus()

        //if user is logged in, display recently viewed
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

    {/*Handles likedList when trackData changes */}
    // useEffect(() => {
    //     // console.log(trackData)
    //     if(localStorage.getItem('userInfo') && trackData && trackData.items && trackData.items.length > 0){
            
    //         const token = JSON.parse(localStorage.getItem('userInfo')).token
            
    //         const getLikeList = async () => {
    //             const response = await fetch(`${apiBaseUrl}/profile/like_list`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify({
    //                     track_list: trackData.items
    //                 })
    //             });
        
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 // console.log(data);
    //                 setLikedList(data);
    //             } else {
    //                 const error = await response.json();
    //                 console.error('Error:', error);
    //             }
    //         }
    //         getLikeList()
    //     }
    // }, [trackData])

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchParams({ query: input });
    };

    const handleTypeClick = (type) => {
        if(type === 'all') {
            navigate(`/search/?query=${query}`)
            setUpdate(prev => prev + 1)
        } else {
            navigate(`/search/?query=${query}&type=${type}`)
            setUpdate(prev => prev + 1)
        }
    }

    const handleShowMore = () => {
        navigate(`/search/?query=${query}&type=${type}&offset=${offset + 50}`)
        setUpdate(prev => prev + 1)
    }

    const divClassNames = `flex items-center rounded-3xl bg-hoverGray text-grayText py-3 px-2 space-x-2 w-full md:w-1/2 
    ${isInputFocused ? 'outline outline-2 outline-white outline-offset-2' : ''}`;

    const buttonClassNames = `${isInputFocused ? 'text-white' : 'text-grayText'}`;
    
    return !awake ? (
            <div className='bg-primary h-dvh flex justify-center mx-auto pt-3 w-full'>
                <Oval
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
            </div>)
            : (
            <div className='bg-primary h-fit flex flex-col px-4 space-y-3 pt-3 md:pt-0 pb-16 md:pb-2'>
                {/* search bar */}
                <form onSubmit={handleSearch}>
                    <div tabIndex={0} className={divClassNames}>
                        <button type="submit" className={buttonClassNames}><FaSearch /></button>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='bg-transparent w-full h-full focus:outline-none'
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                        />
                    </div>
                </form>

                {/* recently viewed section */}
                
                {recentlyViewed && recentlyViewed.length >= 5 && localStorage.getItem('userInfo') && categories && 
                    <div className='flex justify-between items-baseline mb-2'>
                        <Link to='/recent_searches' className='text-2xl text-white font-bold underline md:hover:underline'>Recent searches</Link>
                        <Link to='/recent_searches' className='text-grayText underline md:no-underline md:hover:underline font-semibold'>Show all</Link>
                    </div>
                }
                {recentlyViewed && recentlyViewed.length < 5 && recentlyViewed.length > 0 && localStorage.getItem('userInfo') && categories && 
                    <div className='text-2xl text-white font-bold'>Recent searches</div>
                }
                {recentlyViewed && categories &&
                    <div className='flex overflow-y-auto custom-scrollbar'>
                        
                        {recentlyViewed.map((item, index) => {
                            if(item.type === 'Artist' && index < 5){
                                return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                            } else if(item.type === 'Album' && index < 5){
                                return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                            } else if(item.type === 'Playlist' && index < 5){
                                return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
                            } else if(item.type === 'Audiobook' && index < 5){
                                return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                            } else if(item.type === 'Track' && index < 5){
                                return <TrackCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                            }
                        })}
                    </div>
                }

                {/* category section */}
                {categories && 
                    <div className='space-y-3'>
                        <div className='text-2xl text-white font-bold'>Browse all</div>
                        <div className='flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-4'>
                            {categories.map((category, index) => {
                                return <CategoryCard key={index} name={category[0]} color={category[1]}/>
                            })}
                        </div>
                    </div>
                }

                {/* results section */}
                <div className='space-y-4'>
                    {!categories && 
                        <div className='flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-2 md:gap-x-0 md:space-x-2'>
                            <button onClick={() => handleTypeClick('all')} className={`${!type ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>All</button>
                            <button onClick={() => handleTypeClick('artist')} className={`${type === 'artist' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Artists</button>
                            <button onClick={() => handleTypeClick('album')} className={`${type === 'album' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Albums</button>
                            <button onClick={() => handleTypeClick('track')} className={`${type === 'track' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Songs</button>
                            <button onClick={() => handleTypeClick('playlist')} className={`${type === 'playlist' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Playlists</button>
                            <button onClick={() => handleTypeClick('audiobook')} className={`${type === 'audiobook' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Audiobooks</button>
                        </div>
                    }
                    
                    {/*Track data display for when logged in */}
                    {trackData && !categories && (type === 'track' || !type ) && likedList && likedList.length > 0 &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Songs</div>
                            <div className="flex-flex-col"> 
                                {trackData.items.map((track, index) => {
                                    if(track){
                                        return <TrackSearchCard key={index} popular_track={track} flag={likedList[index]} index={index}/>
                                    }
                                })}
                            </div>

                            {!categories && type === 'track' && trackData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                            }
                        </div>
                    }

                    {/*Track data display for when not logged in */}
                    {trackData && !categories && (type === 'track' || !type ) && !likedList &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Songs</div>
                            <div className="flex-flex-col"> 
                                {trackData.items.map((track, index) => {
                                    if(track){
                                        return <TrackSearchCard key={index} popular_track={track} index={index}/>
                                    }
                                })}
                            </div>

                            {!categories && type === 'track' && trackData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                            }
                        </div>
                    }
                    
                    {artistData && !categories && (type === 'artist' || !type ) &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Artists</div>
                            <div className='flex flex-wrap justify-center md:justify-start'>
                                {artistData.items.map((artist, index) => {
                                    if(artist){
                                        return <ArtistCard key={index} name={artist.name} image={artist.images.length > 0 ? artist.images[0].url : 'default'} id={artist.id}/>
                                    }
                                })}
                            </div>

                            {!categories && type === 'artist' && artistData.total > (offset + 50) &&
                                <div className='flex justify-center md:justify-start pb-4'>
                                    <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                                </div>
                            }
                        </div>
                    }
                    
                    {albumData && !categories && (type === 'album' || !type ) &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Albums</div>
                            <div className='flex flex-wrap justify-center md:justify-start'>
                                {albumData.items.map((album, index) => {
                                    if(album){
                                        return <AlbumCard key={index} name={album.name} artist={album.artists[0].name} image={album.images[0].url} id={album.id}/>
                                    }
                                })}
                            </div>

                            {!categories && type === 'album' && albumData.total > (offset + 50) &&
                                <div className='flex justify-center md:justify-start pb-4'>
                                    <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                                </div>
                            }
                        </div>
                    }
                    
                    {playlistData && !categories && (type === 'playlist' || !type ) &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Playlists</div>
                            <div className='flex flex-wrap justify-center md:justify-start'>
                                {playlistData.items.map((playlist, index) => {
                                    if(playlist && playlist.owner) {
                                        return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/>
                                    } 
                                })}
                            </div>
                            
                            {!categories && type === 'playlist' && playlistData.total > (offset + 50) &&
                                <div className='flex justify-center md:justify-start pb-4'>
                                    <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                                </div>
                            }
                        </div>
                    }
                    
                    {audiobookData && !categories && (type === 'audiobook' || !type ) &&
                        <div>
                            <div className='text-2xl text-white font-bold'>Audiobooks</div>
                            <div className='flex flex-wrap justify-center md:justify-start'>
                                {audiobookData.items.map((audiobook, index) => {
                                    if(audiobook && audiobook.name && audiobook.authors.length > 0){
                                        return <AudiobookCard key={index} name={audiobook.name} author={audiobook.authors[0].name} image={audiobook.images[0].url} id={audiobook.id} />
                                    }
                                })}
                            </div>

                            {!categories && type === 'audiobook' && audiobookData.total > (offset + 50) &&
                                <div className='flex justify-center md:justify-start pb-4'>
                                    <button onClick={handleShowMore} className='bg-spotifyGreen py-2 px-3 text-white rounded-lg mt-2'>Show more</button>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div> 
        
    )
}

export default Search