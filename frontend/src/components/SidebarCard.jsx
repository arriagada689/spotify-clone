import React, { useState } from 'react'
import spotifyImage from '../assets/spotify_default2.jpg';
import { Link } from 'react-router-dom';
import lowercaseFirstLetter from '../utils/lowercaseFirstLetter';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';

const SidebarCard = ({name, id, type, subname, image}) => {
    const determineSubname = () => {
        if (type === 'UserPlaylist' || type === 'Playlist') {
            return 'Playlist';
        } else if (type === 'single' || type === 'compilation') {
            return 'Single / EP';
        } else {
            return capitalizeFirstLetter(type);
        }
    };

    const determineLink = () => {
        if (type === 'UserPlaylist') {
            return `/user_playlist/${id}`;
        } else if (type === 'single' || type === 'compilation') {
            return `/album/${id}`;
        } else {
            return `/${lowercaseFirstLetter(type)}/${id}`;
        }
    }

    const subTitle = determineSubname();
    const cardLink = determineLink();

    return (
        <Link to={cardLink} className='flex p-2 hover:bg-hoverGray space-x-2 rounded-sm w-full'>
            <img src={image !== 'default' ? image : spotifyImage} alt={name} className='h-[50px] w-[50px] rounded-md'/>
            <div className='flex flex-col my-auto'>
                <div className='text-white line-clamp-1'>{name}</div>
                <div className='text-sm line-clamp-1'>{subTitle} - {subname}</div>
            </div>
        </Link>
    )
}

export default SidebarCard