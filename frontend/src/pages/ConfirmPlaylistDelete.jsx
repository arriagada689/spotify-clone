import React, { useEffect } from 'react'
import { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaSpotify } from "react-icons/fa";

const ConfirmPlaylistDelete = () => {
    const { id } = useParams()
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token
    const { updateSidebar } = useContext(AuthContext)
    const [playlistName, setPlaylistName] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const getPlaylistName = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/get_user_playlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setPlaylistName(data.user_playlist.name)
            } else {
                navigate('*')
            }
        }
        getPlaylistName()
    }, [])

    const handlePlaylistDelete = async () => {
        const response = await fetch(`${apiBaseUrl}/profile/delete_user_playlist/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok) {
            const data = await response.json()
            updateSidebar()
            navigate('/')
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className='flex md:items-center md:justify-center bg-primary w-full h-full'>
            <div className='flex flex-col items-center p-3 md:p-0 md:justify-center text-white space-y-6 md:mb-[50px]'>
                <FaSpotify size={200}/>
                <div className='text-center text-3xl'>Are you sure you want to delete <span className='text-spotifyGreen'>{playlistName ? playlistName : ''}</span>?</div>
                <div className='flex items-center'>
                    <button className='border-2 border-red-600 p-3 text-red-700 bg-red-400 font-semibold rounded-md' onClick={() => handlePlaylistDelete()}>Confirm</button>
                    <button className='text-grayText py-3 px-4 font-semibold hover:underline' onClick={goBack}>Go back</button>
                </div>
                
            </div>
        </div>
    )
}

export default ConfirmPlaylistDelete