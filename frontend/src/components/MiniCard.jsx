import React from 'react'
import spotifyImage from '../assets/spotify_default2.jpg';
import { Link } from 'react-router-dom';

const MiniCard = ({ name, image, url }) => {
    
    return (
        <Link to={url}>
            <div className='flex bg-hoverGray hover:bg-miniHover items-center rounded-md w-full pr-1'>
                <img src={image !== 'default' ? image : spotifyImage} alt={name} className='h-[50px] w-[50px] md:h-[70px] md:w-[70px] rounded-l-md'/>
                <div className='text-white ml-3 truncate'>{name}</div>
            </div>
        </Link>
    )
}

export default MiniCard