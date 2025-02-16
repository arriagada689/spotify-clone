import React from 'react'
import { IoMdClose } from "react-icons/io";

const SidebarFilterButtons = ({ handleTypeClick, type, arr }) => {
    
    return (
        <div className='flex'>
            {arr && type === 'All' && 
            <div className='space-x-2 mx-auto'>
                <button onClick={() => handleTypeClick('Playlist')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'>Playlists</button>
                <button onClick={() => handleTypeClick('Artist')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'>Artists</button>
                <button onClick={() => handleTypeClick('Album')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'>Albums</button>
                <button onClick={() => handleTypeClick('Audiobook')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'>Audiobooks</button>
            </div>  
            }
            {(type === 'Playlist' || type === 'UserPlaylist') &&
                <div className='space-x-2 ml-3'>
                    <button onClick={() => handleTypeClick('All')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'><IoMdClose /></button>
                    <button onClick={() => handleTypeClick('Playlist')} className={`${type === 'Playlist' ? 'bg-white text-black' : 'bg-grayBox text-white'} py-2 px-3 text-sm rounded-full hover:bg-lighterGray`}>Playlists</button>
                    <button onClick={() => handleTypeClick('UserPlaylist')} className={`${type === 'UserPlaylist' ? 'bg-white text-black' : 'bg-grayBox text-white'} py-2 px-3 text-sm rounded-full hover:bg-lighterGray`}>By you</button>
                </div> 
            }
            {arr && type === 'Artist' &&
                <div className='space-x-2 ml-3'>
                    <button onClick={() => handleTypeClick('All')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'><IoMdClose /></button>
                    <button onClick={() => handleTypeClick('Artist')} className={`${type === 'Artist' ? 'bg-white text-black' : 'bg-grayBox text-white'} py-2 px-3 text-sm rounded-full hover:bg-lighterGray`}>Artists</button>
                </div> 
            }
            {arr && type === 'Album' &&
                <div className='space-x-2 ml-3'>
                    <button onClick={() => handleTypeClick('All')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'><IoMdClose /></button>
                    <button onClick={() => handleTypeClick('Album')} className={`${type === 'Album' ? 'bg-white text-black' : 'bg-grayBox text-white'} py-2 px-3 text-sm rounded-full hover:bg-lighterGray`}>Albums</button>
                </div> 
            }
            {arr && type === 'Audiobook' &&
                <div className='space-x-2 ml-3'>
                    <button onClick={() => handleTypeClick('All')} className='bg-grayBox text-white py-2 px-3 text-sm rounded-full hover:bg-lighterGray'><IoMdClose /></button>
                    <button onClick={() => handleTypeClick('Audiobook')} className={`${type === 'Audiobook' ? 'bg-white text-black' : 'bg-grayBox text-white'} py-2 px-3 text-sm rounded-full hover:bg-lighterGray`}>Audiobooks</button>
                </div> 
            }
        </div>
    )
}

export default SidebarFilterButtons