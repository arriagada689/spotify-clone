import React from 'react'
import spotifyImage from '../assets/spotify_default2.jpg';
import { Link } from 'react-router-dom';

const SidebarArtist = ({name, id, type, image}) => {

    return (
        <Link to={`/artist/${id}`} className='flex p-2 hover:bg-hoverGray space-x-2 rounded-sm w-full'>
            <img src={image !== 'default' ? image : spotifyImage} alt={name} className='h-[50px] w-[50px] rounded-full'/>
            <div className='flex flex-col my-auto'>
                <div className='text-white line-clamp-1'>{name}</div>
                <div className='text-sm line-clamp-1'>{type}</div>
            </div>
        </Link>
    )
}

export default SidebarArtist