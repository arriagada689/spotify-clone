import React, { useEffect, useState, useContext } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { FaSpotify } from "react-icons/fa";
import { AuthContext } from '../contexts/AuthContext.jsx';

const UpdateProfile = () => {
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { updateSidebar } = useContext(AuthContext)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    useEffect(() => {
        const getProfileData = async () => {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/users/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok) {
                const data = await response.json()
                setUsername(data.username)
            }
        }
        getProfileData()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username
                })
            })
            if(response.ok) {
                updateSidebar()
                navigate(`/profile`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }
    }
    
    return (
        <div className='flex bg-primary w-full h-full pt-4 md:pt-0 md:items-center justify-center'>
            <div className='flex flex-col text-grayText md:mb-[50px] space-y-5 w-2/3 lg:w-1/2'>
                <FaSpotify size={150} className='mx-auto text-white'/>
                <div className='text-center text-4xl font-bold text-white'>Update Profile</div>
                {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
                <Form onSubmit={ submitHandler } className='space-y-6'>
                    <div className='flex flex-col space-y-2 mb-2'>
                        <label htmlFor="username">New username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                            className='border border-gray-400 bg-primary rounded-md p-2 w-full'
                        />
                        <div className='text-xs'>Username must be 150 characters or fewer and contain only letters, digits and @/./+/-/_.</div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className='bg-spotifyGreen w-fit text-white text-lg py-2 px-3 rounded-lg mb-4 font-semibold'>Update</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default UpdateProfile