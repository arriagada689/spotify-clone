import React, { useEffect, useState } from 'react'
import { Form, useNavigate, useParams } from 'react-router-dom'
import { FaSpotify } from "react-icons/fa";

const UpdatePlaylist = () => {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getUserPlaylistData = async () => {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/get_user_playlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setName(data.user_playlist.name)
                setDescription(data.user_playlist.description)
            }
        }
        getUserPlaylistData()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_user_playlist`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    description: description
                })
            })
            if(response.ok) {
                navigate(`/user_playlist/${id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error){
            console.error(error)
            setErrorMessage(error.message)
        }
    }
    
    return (
        <div className='flex bg-primary w-full h-full pt-4 md:pt-0 md:items-center justify-center'>
            <div className='flex flex-col text-grayText md:mb-[50px] space-y-5 w-2/3 lg:w-1/2'>
                <FaSpotify size={150} className='mx-auto text-white'/>
                <div className='text-center text-4xl font-bold text-white'>Update Playlist</div>
                {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
                <Form onSubmit={ submitHandler }>
                    <div className='flex flex-col space-y-2 mb-2'>
                        <label htmlFor="username">Playlist name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            required
                            className='border border-gray-400 bg-primary rounded-md p-2 w-full'
                        />
                        <div className='text-xs'>50 character limit</div>
                    </div>
                    <div className='flex flex-col space-y-2 mb-4'>
                        <label htmlFor="password">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='border border-gray-400 bg-primary rounded-md p-2 w-full h-32 resize-vertical'
                            placeholder="Enter playlist description"
                        ></textarea>
                        <div className='text-xs'>(Optional)</div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className='bg-spotifyGreen w-fit text-white text-lg py-2 px-3 rounded-lg mb-4 font-semibold'>Update</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePlaylist