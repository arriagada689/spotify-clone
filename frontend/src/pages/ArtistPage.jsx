import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import DiscographyCard from '../components/DiscographyCard.jsx';
import spotifyImage from '../assets/spotify_default2.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';
import TrackFlexCard from '../components/TrackFlexCard.jsx';
import { Oval } from 'react-loader-spinner'
// import sampleArtistData from '../sample_data/artistData.js';
// import sampleArtistDiscography from '../sample_data/artistDiscography.js';

const colors = ['red2', 'blue2', 'green2', 'teal2', 'purple2']

const ArtistPage = () => {
    const { id } = useParams()
    const [artist, setArtist] = useState(null)
    const [discography, setDiscography] = useState(null)
    const [fullDiscography, setFullDiscography] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState('album')
    const [popularTracks, setPopularTracks] = useState(null)
    const [fullPopularTracks, setFullPopularTracks] = useState(null)
    const [seeMore, setSeeMore] = useState(false)
    // const [relatedArtists, setRelatedArtists] = useState(null)
    const [following, setFollowing] = useState(null)
    const [likedList, setLikedList] = useState(null)
    const { updateSidebar } = useContext(AuthContext)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getArtistData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_artist/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setArtist(data.artist_data)
                sessionStorage.setItem('artist_name', JSON.stringify(data.artist_data.name));
                setPopularTracks(data.popular_tracks.slice(0, 5))
                setFullPopularTracks(data.popular_tracks);
                // setRelatedArtists(data.related_artists)
            }
        }

        const getArtistDiscrography = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_artist_discography/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setFullDiscography(data.discography);
                sessionStorage.setItem('discography_data', JSON.stringify({ 'artist_id': id, 'discography': data.discography }));
                
                //initial filtering
                let arr = []
                arr = data.discography.filter(album => album.album_type === 'album' && album.album_group === 'album').slice(0, 8);
                setDiscography(arr);
            }
        }
        getArtistDiscrography()
        getArtistData()

        // setArtist(sampleArtistData.artist_data);
        // setPopularTracks(sampleArtistData.popular_tracks.slice(0, 5));
        // setFullPopularTracks(sampleArtistData.popular_tracks);
        // setDiscography(sampleArtistDiscography.discography.slice(0, 8));
        // setFullDiscography(sampleArtistDiscography.discography);
    }, [id])

    useEffect(() => {
        //Check user's following status if logged in

        if(localStorage.getItem('userInfo') && artist){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/artist/${id}`, {
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
                        name: artist.name,
                        id: artist.id,
                        image: artist.images.length > 0 ? artist.images[0].url : 'default',
                        type: 'Artist'
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
    }, [artist])

    {/*Gets list of liked songs status for each popular track */}
    useEffect(() => {
        if(localStorage.getItem('userInfo') && popularTracks && popularTracks.length > 0){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getLikeList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/like_list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        track_list: popularTracks
                    })
                })
                if(response.ok){
                    const data = await response.json()
                    setLikedList(data)
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            getLikeList()
        }
    }, [popularTracks])

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
                    name: artist.name,
                    id: artist.id,
                    image: artist.images.length > 0 ? artist.images[0].url : 'default',
                    type: 'Artist'
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
                    id: artist.id,
                    type: 'Artist'
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

    const toggleSeeMore = () => {
        if(seeMore){
            setPopularTracks(fullPopularTracks.slice(0, 5));
        } else {
            setPopularTracks(fullPopularTracks);
        }
        setSeeMore(prev => !prev);
    }

    /*Handles discography filter changes */
    const handleDiscographyFilter = (type) => {
        let arr = [];

        if(type === 'album'){
            setSelectedFilter('album');
            arr = fullDiscography.filter(album => album.album_type === 'album' && album.album_group === 'album').slice(0, 8);
            setDiscography(arr);
        } else if(type === 'single-ep'){
            setSelectedFilter('single-ep');
            arr = fullDiscography.filter(album => album.album_type === 'single' && album.album_group === 'single').slice(0, 8);
            setDiscography(arr);
        } else if(type === 'compilation'){
            setSelectedFilter('compilation');
            arr = fullDiscography.filter(album => album.album_type === 'compilation' && album.album_group === 'compilation').slice(0, 8);
            setDiscography(arr);
        }
    }

    const checkButton = (type) => {
        if(type === 'album'){
            const flag = fullDiscography.some(album => album.album_type === 'album' && album.album_group === 'album');
            return flag;
        } else if(type === 'single-ep'){
            const flag = fullDiscography.some(album => album.album_type === 'single' && album.album_group === 'single');
            return flag;
        } else if(type === 'compilation'){
            const flag = fullDiscography.some(album => album.album_type === 'compilation' && album.album_group === 'compilation');
            return flag;
        }
    }
    
    return (
        <div className='flex flex-col bg-primary px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-6'>
            {artist && 
                <div className='flex flex-col md:flex-row items-center'>
                    {artist.images.length > 0 ? <img src={artist.images[0].url} alt={artist.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/> : <img src={spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>}
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Artist</div>
                        <div className='text-2xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{artist.name}</div>
                        <a href={artist.external_urls.spotify} target="_blank"><span className='text-spotifyGreen underline md:hover:underline'>Spotify Link</span></a>

                        <div className='text-grayText text-wrap'>Genres: {artist.genres.join(', ')}</div>
                    </div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='text-xl text-grayText font-semibold'><Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save the artist to your library.</div>}
            {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Unfollow</button>}
            {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Follow</button>}

            {/*Popular tracks section when logged in*/}
            {popularTracks && popularTracks.length > 0 && likedList && likedList.length > 0 && 
                <div>
                    <div className='text-2xl text-white font-bold mb-2'><span className='text-spotifyGreen'>{artist ? artist.name : ''}</span>'s top tracks</div>
                    <div className="flex-flex-col">
                        {popularTracks.map((track, index) => {
                            if(track){
                                return <TrackFlexCard key={index} popular_track={track} flag={likedList[index]} index={index}/>
                            }})
                        }
                    </div>

                    <button onClick={() => toggleSeeMore()} className='text-grayText font-semibold mt-2 hover:text-white'>See more</button>
                </div>
            }

            {/*Popular tracks section when not logged in*/}
            {popularTracks && popularTracks.length > 0 && !likedList &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Popular tracks by <Link to={`/artist/${artist.id}`} className='text-green-500 underline md:no-underline md:hover:underline'>{artist ? artist.name : ''}</Link></div>
                    
                    <div className="flex-flex-col">
                        {popularTracks.map((track, index) => {
                            if(track){
                                return <TrackFlexCard key={index} popular_track={track} index={index}/>
                            } 
                        })}
                    </div>
                    
                    {fullPopularTracks.length > 5 && 
                        <button onClick={() => toggleSeeMore()} className='text-grayText font-semibold mt-2 hover:text-white'>See more</button>
                    }
                </div>
            }

            {/*Incase of loading artists */}
            {discography === null &&
                <div className='flex mx-auto'>
                    <Oval
                    visible={true}
                    height="220"
                    width="180"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
            }

            {discography && discography.length > 0 &&
                <div className='w-full'>
                    <div className='flex justify-between items-baseline mb-2'>
                        <Link to={`/artist/${id}/discography`} className='text-2xl text-white font-bold underline md:no-underline md:hover:underline'>Discography</Link>
                        <Link to={`/artist/${id}/discography`} className='text-grayText underline md:no-underline md:hover:underline font-semibold '>Show all</Link>
                    </div>

                    <div className='flex space-x-2 my-4'>
                        {checkButton('album') && 
                            <button onClick={() => handleDiscographyFilter('album')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'album' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Albums</button>}
                        {checkButton('single-ep') && 
                            <button onClick={() => handleDiscographyFilter('single-ep')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'single-ep' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Singles and EPs</button>}
                        {checkButton('compilation') && 
                            <button onClick={() => handleDiscographyFilter('compilation')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'compilation' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Compilations</button>} 
                    </div>

                    <div className='flex w-full overflow-x-auto md:overflow-hidden'>
                        {discography.map((album, index) => {
                            return <DiscographyCard key={index} name={album.name} image={album.images[0].url} id={album.id} type={album.album_type} year={album.release_date.slice(0, 4)}/>
                        })}
                    </div>
                </div>
            }

            {/* {relatedArtists && relatedArtists.length > 0 &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Related artists</div>
                    <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                        {relatedArtists && 
                            relatedArtists.map((artist, index) => {
                                return <ArtistCard key={index} name={artist.name} image={artist.images.length > 0 ? artist.images[0].url : 'default'} id={artist.id}/>
                            })
                        }
                    </div>
                </div>
            } */}
        </div>
    )
}

export default ArtistPage