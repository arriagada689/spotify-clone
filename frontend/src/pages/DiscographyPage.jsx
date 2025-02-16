import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DiscographyCard from '../components/DiscographyCard';

const DiscographyPage = () => {
    const { id } = useParams()
    const discographyData = JSON.parse(sessionStorage.getItem('discography_data')) || null;
    const artistName = JSON.parse(sessionStorage.getItem('artist_name')) || null;

    const [discography, setDiscography] = useState(null)
    const [fullDiscography, setFullDiscography] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all')

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if(discographyData && discographyData.artist_id === id){
            setFullDiscography(discographyData.discography);

            //initial filtering and sorting (get rid of appears on albums)
            let arr = []
            arr = discographyData.discography.filter(album => album.album_group !== 'appears_on');
            let sortedArr = arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            setDiscography(sortedArr);
        } else {
            const getArtistDiscrography = async () => {
                const response = await fetch(`${apiBaseUrl}/spotify/get_artist_discography/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setFullDiscography(data.discography);

                    //initial filtering and sorting (get rid of appears_on)
                    let arr = [];
                    arr = data.discography.filter(album => album.album_group !== 'appears_on');
                    let sortedArr = arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                    setDiscography(sortedArr);
                }
            }
            getArtistDiscrography();
        }
    }, [])

    /*Handles discography filter changes */
    const handleDiscographyFilter = (type) => {
        let arr = [];

        if(type === 'album'){
            setSelectedFilter('album');
            arr = fullDiscography.filter(album => album.album_type === 'album' && album.album_group === 'album');
            setDiscography(arr);
        } else if(type === 'single-ep'){
            setSelectedFilter('single-ep');
            arr = fullDiscography.filter(album => album.album_type === 'single' && album.album_group === 'single');
            setDiscography(arr);
        } else if(type === 'compilation'){
            setSelectedFilter('compilation');
            arr = fullDiscography.filter(album => album.album_type === 'compilation' && album.album_group === 'compilation');
            setDiscography(arr);
        } else if(type === 'all'){
            setSelectedFilter('all');
            arr = fullDiscography.filter(album => album.album_group !== 'appears_on');
            let sortedArr = arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            setDiscography(sortedArr);
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
        <div className='bg-primary px-5 pb-16 md:pb-2 h-fit w-full pt-3 md:pt-0 md:rounded-b-md'>
            {discographyData ? 
                <div className='text-2xl text-white font-bold mb-2'><Link to={`/artist/${id}`} className='text-spotifyGreen hover:underline'>{artistName ? artistName : ''}</Link>'s Discography</div> :
                <div className='text-2xl text-white font-bold mb-2'>Discography</div>
            }

            
            {discography && discography.length > 0 && 
                <div className='flex space-x-2 my-4'>
                    <button onClick={() => handleDiscographyFilter('all')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'all' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>All</button>
                    {checkButton('album') && 
                        <button onClick={() => handleDiscographyFilter('album')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'album' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Albums</button>}
                    {checkButton('single-ep') && 
                        <button onClick={() => handleDiscographyFilter('single-ep')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'single-ep' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Singles and EPs</button>}
                    {checkButton('compilation') && 
                        <button onClick={() => handleDiscographyFilter('compilation')} className={`py-2 px-3 text-sm rounded-full hover:bg-lighterGray ${selectedFilter === 'compilation' ? 'bg-white text-black' : 'bg-grayBox text-white'}`}>Compilations</button>} 
                </div>
            }

            {discography && discography.length > 0 && 
                <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                    { 
                        discography.map((album, index) => {
                            return <DiscographyCard key={index} name={album.name} image={album.images[0].url} id={album.id} type={album.album_type} year={album.release_date.slice(0, 4)}/>
                        })
                    }
                </div>
            }
                
        </div>
    )
}

export default DiscographyPage