import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { Oval } from 'react-loader-spinner'
import spotifyImage from '../assets/spotify_default2.jpg';
import GridDropdownButton from '../components/GridDropdownButton.jsx';
import ListGrid2 from '../components/ListGrid2.jsx';
import CompactGrid2 from '../components/CompactGrid2.jsx';
import RecommendedTrackCard from '../components/RecommendedTrackCard.jsx';
import { LuPen } from "react-icons/lu";
import firebase from 'firebase/compat/app'
import "firebase/compat/storage"
import getFirebaseConfig from '../utils/firebaseConfig';
import storeUserPlaylistImage from '../utils/storeUserPlaylistImage.js';
import { titleDescending, titleAscending, durationDescending, durationAscending } from '../utils/sortingPlaylists.js';

const UserPlaylistPage = () => {
    const isMounted = useRef(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'track'
    const offset = Number(searchParams.get('offset')) || 0;
    const [input, setInput] = useState('')
    const [trackData, setTrackData] = useState(null)
    const [audiobookData, setAudiobookData] = useState(null)
    const [results, setResults] = useState(false)
    const [total, setTotal] = useState(null)
    const [update, setUpdate] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [isInputFocused, setInputFocused] = useState(false);
    const [gridView, setGridView] = useState('List')
    const [gridDropdown, setGridDropdown] = useState(false)
    const [recommendedTracks, setRecommendedTracks] = useState(null)
    const [imageUpdate, setImageUpdate] = useState(0)
    const [imageLoading, setImageLoading] = useState(0)
    const [sortingMetric, setSortingMetric] = useState(3)

    const { id } = useParams()
    const [userPlaylist, setUserPlaylist] = useState(null)
    const [playlistItems, setPlaylistItems] = useState(null)
    const [addedOn, setAddedOn] = useState(null)
    const [trackCount, setTrackCount] = useState(null)
    const [audiobookCount, setAudiobookCount] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token

    useEffect(() => {
        //fetch user_playlist data
        const getUserPlaylistData = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/get_user_playlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setTrackCount(data.track_count)
                setAudiobookCount(data.audiobook_count)
                setUserPlaylist(data.user_playlist)
                setPlaylistItems(data.playlist_items)
                setAddedOn(data.added_on)
            }
        }
        getUserPlaylistData()
    }, [id, searchParams, update, imageUpdate])

    /*Handles sorting changes */
    useEffect(() => {
        if(playlistItems){
            if(sortingMetric === 1){
                titleAscending(playlistItems, setPlaylistItems)
            } else if(sortingMetric === 2){
                titleDescending(playlistItems, setPlaylistItems)
            } else if(sortingMetric === 5){
                durationAscending(playlistItems, setPlaylistItems)
            } else if(sortingMetric === 6){
                durationDescending(playlistItems, setPlaylistItems) 
            }
        }
        
    }, [sortingMetric])

    {/*Function to upload image file to firebase */}
    const handleFileUpload = async (e) => {
        //grab file and get firebase config data
        const selectedFile = e.target.files[0]
        const firebaseConfig = await getFirebaseConfig(token)
        firebase.initializeApp(firebaseConfig)

        if(selectedFile){
            const storageRef = firebase.storage().ref()
            const folderName = 'spotify-clone-app';
            const fileRef = storageRef.child(`${folderName}/${selectedFile.name}`)
            fileRef.put(selectedFile)
                .then((snapshot) => {
                    snapshot.ref.getDownloadURL()
                    .then(async (downloadUrl) => {
                        
                        //store firebase image link in db
                        const status = await storeUserPlaylistImage(downloadUrl, token, id)
                        setImageUpdate(prev => prev + 1)
                    })
                })
        } else {
            console.log('no file selected');
        }
    }

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    {/*Handles recommended tracks */}
    // useEffect(() => {
    //     //check if any tracks in playlist
    //     if(playlistItems && playlistItems.length > 0 && !isMounted.current){
    //         const trackIds = []

    //         //iterate through playlist items to see if any tracks
    //         for(const item of playlistItems){
    //             if(item.type === 'Track'){
    //                 trackIds.push(item.id)
    //             }
    //             if(trackIds.length === 5){
    //                 break
    //             }
    //         }
            
    //         if(trackIds.length > 0){
    //             //create the comma separated string
    //             const str = trackIds.splice(0, 5).join(',')
                
    //             const getRecommendedTracks = async () => {
    //                 const response = await fetch(`${apiBaseUrl}/spotify/recommended/${id}?track_ids=${str}`, {
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `Bearer ${token}`
    //                     }
    //                 })
    //                 if(response.ok){
    //                     const data = await response.json()
    //                     if(data.tracks && data.tracks.length > 0){
    //                         setRecommendedTracks(data.tracks)
    //                         // console.log(data.tracks);
    //                     }
    //                 } else {
    //                     const error = await response.json()
    //                     console.error(error)
    //                 }
    //             }
    //             getRecommendedTracks()
    //         }
    //         isMounted.current = true;
    //     }
    // }, [id, playlistItems])

    {/*Handles sub search query functionality */}
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        if(query){
            setLoading(true)
            const searchQuery = async () => {
                let url = `${import.meta.env.VITE_API_BASE_URL}/profile/sub_search`;
                //attach query params
                if(query && type && offset){
                    url += `?query=${query}&type=${type}&offset=${String(offset)}&playlist_id=${id}`
                }
                else if(query && type){
                    url += `?query=${query}&type=${type}&playlist_id=${id}`
                }
                else if(query) {
                    url += `?query=${query}&playlist_id=${id}`
                }
    
                const response = await fetch(url, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                })
                if(response.ok) {
                    const data = await response.json();
                    setLoading(false)
                    setResults(true)
                    setTotal(data.total)
                    setTrackData(data.tracks);
                    setAudiobookData(data.audiobooks);
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            searchQuery()
        }
        
    }, [query, update])

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchParams({ query: input });
    };

    const addToPlaylist = async (data, duration) => {
        
        if(data.type === 'track'){
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: id,
                    type: 'Track',
                    name: data.name,
                    id: data.id,
                    image: data.album.images[0].url,
                    artist: data.artists[0].name,
                    album: data.album.name,
                    duration: data.duration_ms
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            }
        } else if(data.type === 'audiobook') {
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: id,
                    type: 'Audiobook',
                    name: data.name,
                    id: data.id,
                    image: data.images[0].url,
                    author: data.authors[0].name,
                    duration: duration
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            }
        }
    }
    const removeFromPlaylist = async (data) => {
        const response = await fetch(`${apiBaseUrl}/profile/remove_item`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                playlist_id: id,
                type: data.type === 'track' ? 'Track' : 'Audiobook',
                id: data.id
            })
        })
        if(response.ok) {
            setUpdate(prev => prev + 1)
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const handleTypeClick = (type) => {
        if(type === 'track'){
            navigate(`/user_playlist/${id}?query=${query}&type=track`)
            setUpdate(prev => prev + 1)
        } else {
            navigate(`/user_playlist/${id}?query=${query}&type=audiobook`)
            setUpdate(prev => prev + 1)
        }
    }

    const handleShowMore = () => {
        navigate(`/user_playlist/${id}?query=${query}&type=${type}&offset=${offset + 10}`)
        setUpdate(prev => prev + 1)
    }

    const divClassNames = `flex items-center rounded-3xl bg-hoverGray text-grayText py-3 px-2 space-x-2 w-full md:w-1/2 
    ${isInputFocused ? 'outline outline-2 outline-white outline-offset-2' : ''}`;

    const buttonClassNames = `${isInputFocused ? 'text-white' : 'text-grayText'}`;
  
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {userPlaylist && 
                <div className='flex flex-col md:flex-row items-center'>
                    {imageLoading ? (
                        <div className='h-[270px] w-[270px] flex items-center justify-center flex-shrink-0'>
                            <Oval
                                visible={true}
                                height="80"
                                width="80"
                                color="#4fa94d"
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : (
                        <div className='relative image-parent h-[270px] w-[270px] flex-shrink-0 hover:cursor-pointer'>
                            <img src={userPlaylist.image ? userPlaylist.image : spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>

                            <input 
                                type='file' 
                                id='fileInput' 
                                style={{ display: 'none' }} 
                                accept='.png, .jpg, .jpeg'
                                onChange={handleFileUpload} 
                            />

                            {/*Hover div */}
                            <div onClick={triggerFileInput} className='hover-show absolute inset-0 h-full w-full flex-col items-center justify-center rounded-md'>
                                <LuPen size={50} className='text-white z-20'/>
                                <div className='font-semibold text-white z-20'>Choose photo</div>
                            </div>

                            {/*Dark overlay */}
                            <div className='hover-show absolute inset-0 h-full w-full flex-col items-center justify-center rounded-md z-10 bg-black opacity-50'></div>
                        </div>
                    )
                    }
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Playlist</div>
                        <Link to={`/update_playlist/${id}`} className='text-2xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4 hover:cursor-pointer'>{userPlaylist.name}</Link>
                        {userPlaylist.description.length > 0 && <div className='text-wrap text-sm'>{userPlaylist.description}</div>}
                        <div className='flex space-x-3'>
                            <Link to={`/profile`} className='underline md:no-underline md:hover:underline'>{userPlaylist.creator}</Link>
                            <div className='text-white'>{trackCount} song(s) {audiobookCount} audiobook(s)</div>
                        </div>
                    </div>
                </div>
            }
            <div className="flex justify-between flex-wrap gap-y-3 items-center ">
                <div className='space-x-3'>
                    <Link to={`/update_playlist/${id}`} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Update Playlist</Link>
                    <Link to={`/confirm_playlist_delete/${id}`} className='bg-red-500 w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Remove Playlist</Link>
                </div>

                {/*Grid view button with dropdown */}
                <GridDropdownButton gridDropdown={gridDropdown} gridView={gridView} setGridDropdown={setGridDropdown} setGridView={setGridView} sortingMetric={sortingMetric} setSortingMetric={setSortingMetric}/>
            </div>

            {/* List grid */}
            {playlistItems && addedOn && gridView === 'List' &&
                <ListGrid2 playlistItems={playlistItems} addedOn={addedOn}/>
            }

            {/*Compact grid */}
            {playlistItems && addedOn && gridView === 'Compact' &&
                <CompactGrid2 playlistItems={playlistItems} addedOn={addedOn}/>
            }

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

            {loading ? 
                <div>
                    <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
                :
                <div className='space-y-5'>
                    {/* filter buttons */}
                    {results &&
                    <div className='flex space-x-3'>
                        <button onClick={() => handleTypeClick('track')} className={`${type === 'track' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Songs</button>
                        <button onClick={() => handleTypeClick('audiobook')} className={`${type === 'audiobook' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Audiobooks</button>
                    </div>}

                    {trackData && trackData.length > 0 &&
                        <div className='flex flex-col'>
                            {trackData.map((item, index) => {
                                return <Link to={`/track/${item[1].id}`} key={index}>
                                            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                                                <img src={item[1].album.images[0].url} alt={item[1].name} className='h-[45px] w-[45px]'/>
                                                <div className='flex w-full justify-between ml-2 items-center'>
                                                    <div className='flex flex-col'>
                                                        <div className='text-white'>{item[1].name}</div>
                                                        <div className='text-grayText text-sm'>{item[1].artists[0].name}</div>
                                                    </div>
                                                    {item[0] ? 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation(); 
                                                            removeFromPlaylist(item[1]);
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Remove</button> :
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation(); 
                                                            addToPlaylist(item[1], null);
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Add</button>
                                                    }
                                                </div>
                                            </div>
                                        </Link> 
                            })}
                        </div>
                    }

                    {audiobookData && audiobookData.length > 0 &&
                        <div className='flex flex-col'>
                            {audiobookData.map((item, index) => {
                                return <Link to={`/audiobook/${item[1].id}`} className='space-x-3' key={index}>
                                            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                                                <img src={item[1].images[0].url} alt={item[1].name} className='h-[45px] w-[45px]'/>
                                                <div className='flex w-full justify-between ml-2 items-center'>
                                                    <div className='flex flex-col'>
                                                        <div className='text-white'>{item[1].name}</div>
                                                        <div className='text-grayText text-sm'>{item[1].authors[0].name}</div>
                                                    </div>
                                                    {item[0] ? 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            removeFromPlaylist(item[1])
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Remove</button> : 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToPlaylist(item[1], item[2])
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Add</button>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                            })}
                        </div>
                    }

                    {results && (total > (offset ? offset : 0) + 10) &&
                        <button onClick={handleShowMore} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 rounded-2xl'>Show more</button>
                    }
                </div>
            }

            {/*Recommended tracks section */}
            {/* {recommendedTracks && recommendedTracks.length > 0 &&
                <>
                    <div className='space-y-1'> 
                        <div className='text-2xl text-white font-bold'>Recommended</div>
                        <div className="text-grayText font-semibold">Based on what's in this playlist</div>
                    </div>

                    <div className='flex flex-col'>
                        {recommendedTracks.map((track) => {
                            if(track[1].id && track[1].album.images && track[1].album.images.length > 0){
                                return (
                                    <RecommendedTrackCard 
                                        key={track[1].id} 
                                        track={track[1]} 
                                        flag={track[0]} 
                                        addToPlaylist={addToPlaylist} 
                                        removeFromPlaylist={removeFromPlaylist}
                                        recommendedTracks={recommendedTracks}
                                        setRecommendedTracks={setRecommendedTracks}
                                    />
                                )  
                            }
                        })}
                    </div>
                </>
            } */}
            
        </div>
    )
}

export default UserPlaylistPage