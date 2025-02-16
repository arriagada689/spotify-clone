import React from 'react'
import { FaSpotify } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Logout = () => {
  return (
    <div className='flex md:items-center justify-center bg-primary w-full h-full'>
        <div className='flex flex-col items-center p-3 md:p-0 md:justify-center text-white space-y-6 md:mb-[50px]'>
            <FaSpotify size={200} className='mx-auto text-white'/>
            <div className='text-center text-3xl'>You have been logged out.</div>
            <Link to={'/login'} className='text-center text-xl underline text-spotifyGreen'>Log in again</Link>
        </div>
    </div>
  )
}

export default Logout