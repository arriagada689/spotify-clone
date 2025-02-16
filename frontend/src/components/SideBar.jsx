import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SidebarCard from './SidebarCard.jsx'
import SidebarArtist from './SidebarArtist.jsx'
import { AuthContext } from '../contexts/AuthContext.jsx';
import SidebarFilterButtons from './SidebarFilterButtons.jsx'
import { Oval } from 'react-loader-spinner'
import { FaHouse } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { BiLibrary } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import likedSongsImage from '../assets/liked-songs.png';
import { TiPin } from "react-icons/ti";

const SideBar = () => {
    const location = useLocation();
    const [arr, setArr] = useState(null)
    const [type, setType] = useState('All')
    const [selected, setSelected] = useState('Home')
    const [likedSongs, setLikedSongs] = useState(null)
    const { sidebarUpdate } = useContext(AuthContext);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setSelected('Home');
        } else if (path.includes('/search')) {
            setSelected('Search');
        } else if (path.includes('/about')) {
            setSelected('About');
        }
    }, [location.pathname]);
    
    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getSidebarData = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/sidebar_data?type=${type}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setArr(data)
                }
            }
            getSidebarData()

        } else {
            setArr(null)
        }
        
    }, [type, sidebarUpdate, localStorage.getItem('userInfo')])

    {/*Handles liked songs initial data and updates */}
    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const getLikedSongsData = async () => {
                const token = JSON.parse(localStorage.getItem('userInfo')).token
                const response = await fetch(`${apiBaseUrl}/profile/liked_songs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    if(data.liked_songs && data.liked_songs.length > 0){
                        setLikedSongs(data.liked_songs)
                    }
                    // console.log(data.liked_songs)
                }
            }
            getLikedSongsData()
        }
    }, [sidebarUpdate, localStorage.getItem('userInfo')])

    const handleTypeClick = (type) => {
        setType(type)
    }
    
    return (
        <div className='flex flex-row md:flex-col fixed h-[60px] w-full bottom-0 md:top-0 md:left-0 md:h-full md:w-[375px] md:pt-2 md:pl-2 md:pb-2 md:space-y-2'>
            
                <div className='flex flex-row justify-between md:justify-start md:flex-col w-full bg-black md:bg-primary text-grayText md:rounded-lg px-6 py-4 md:space-y-4'>
                    <Link to='/' onClick={() => setSelected('Home')} className={`flex items-center space-x-2 md:space-x-4 font-semibold ${selected === 'Home' ? 'text-white' : ''}`}>
                        <FaHouse size={22}/><div className='text-lg'>Home</div>
                    </Link>
                    <Link to='/search' onClick={() => setSelected('Search')} className={`flex items-center space-x-2 md:space-x-4 font-semibold ${selected === 'Search' ? 'text-white' : ''}`}>
                        <FaSearch size={22}/><div className="text-lg">Search</div>
                    </Link>
                    <Link to='/about' onClick={() => setSelected('About')} className={`flex items-center space-x-2 md:space-x-4 font-semibold ${selected === 'About' ? 'text-white' : ''}`}>
                        <FaCode size={22}/><div className="text-lg">About</div>
                    </Link>
                </div>

                <div className='hidden md:flex flex-col bg-primary text-grayText rounded-lg h-full'>
                    <div className='flex justify-between p-3'>
                        <div className='flex items-center space-x-2 font-semibold'>
                            <BiLibrary size={22}/>
                            <div className='text-lg'>Your library</div>
                        </div>
                        <div className="relative group">
                            <Link to='/create_playlist' className="flex items-center justify-center">
                                <FaPlus size={22}/>
                            </Link>
                            <div className="absolute bottom-full mb-1 px-2 py-1 text-sm text-white bg-grayBox rounded hidden group-hover:block whitespace-nowrap -ml-8">
                                Create Playlist
                            </div>
                        </div>
                    </div>
                    

                    {/*Sidebar 3 conditions: not logged in, logged in loading, logged in loaded */}
                    {!localStorage.getItem('userInfo') && 
                        <div className='bg-grayBox p-4 m-2 rounded-md text-white space-y-2'>
                            <div className='font-semibold text-lg'>Create an account or log in</div>
                            <div>The features after creating an account include:</div>
                            <ul className='list-disc pl-5'>
                                <li>Creating your own customizable playlists</li>
                                <li>Saving artists, albums, and audiobooks to your library</li>
                                <li>Keep track of your recently viewed tracks, artists, albums, playlists, and audiobooks</li>
                                <li>Customizing your profile</li>
                            </ul>
                            <div className='flex items-center space-x-4 justify-center'>
                                <Link className='text-white bg-dark w-fit font-medium rounded-2xl py-2 px-3'>Log in</Link>
                                <Link className='text-black bg-white w-fit font-medium rounded-2xl py-2 px-3'>Sign up</Link>
                            </div>
                        </div>
                    }

                    {/* sidebar filter section */}
                    {localStorage.getItem('userInfo') && !arr &&
                        <div className='mx-auto'>
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
                    }
                    {localStorage.getItem('userInfo') && arr && 
                        <div className='px-2 w-full'>
                            <SidebarFilterButtons arr={arr} handleTypeClick={handleTypeClick} type={type}/>

                            <div className='mt-3 max-h-[72vh] w-full overflow-y-auto overflow-x-hidden custom-scrollbar'>
                                {likedSongs && likedSongs.length > 0 && (type === 'All' || type === 'Playlist' || type === 'UserPlaylist') &&
                                    <Link to={'/liked_songs'} className='flex p-2 hover:bg-hoverGray space-x-2 rounded-sm w-full'>
                                        <img src={likedSongsImage} alt={'Liked Songs'} className='h-[50px] w-[50px] rounded-md'/>
                                        <div className='flex flex-col my-auto'>
                                            <div className='text-white line-clamp-1'>Liked Songs</div>
                                            <div className='text-sm line-clamp-1 flex items-center space-x-2'><TiPin className='text-spotifyGreen' size={20}/> <span>Playlist</span> <span>{'-'}</span><span>{likedSongs.length} song(s)</span></div>
                                        </div>
                                    </Link>
                                }
                                {arr && 
                                    arr.map((item, index) => {
                                        // console.log(item)
                                        if(item){
                                            if(item.type === 'Artist'){
                                                return <SidebarArtist key={index} name={item.name} type={item.type} id={item.id} image={item.image}/>
                                            } else if(item.type === 'Album'){
                                                return <SidebarCard key={index} name={item.name} type={item.album_type} id={item.id} subname={item.artist} image={item.image}/>
                                            } else if(item.type === 'Playlist'){
                                                return <SidebarCard key={index} name={item.name} type={item.type} id={item.id} subname={item.creator} image={item.image}/>
                                            } else if(item.type === 'Audiobook'){
                                                return <SidebarCard key={index} name={item.name} type={item.type} id={item.id} subname={item.author} image={item.image}/>
                                            } else if(item.type === 'UserPlaylist'){
                                                return <SidebarCard key={index} name={item.name} type={item.type} id={item._id} subname={item.creator} image={item.image ? item.image : 'default'}/>
                                            }
                                        }
                                    }) 
                                }
                            </div>
                            {arr && arr.length === 0 && !likedSongs &&
                                <div className='bg-grayBox p-4 m-2 rounded-md text-white space-y-2'>
                                    <ul className='list-disc pl-5'>
                                        <li>Create your own customizable playlists</li>
                                        <li>Save artists, albums, and audiobooks to your library</li>
                                        <li>Keep track of your recently viewed tracks, artists, albums, playlists, and audiobooks</li>
                                        <li>Customize your profile</li>
                                    </ul>
                                </div>
                            }
                        </div>
                    }
                    
                </div>
                
            
        </div>
    )
}

export default SideBar