import React from 'react'
import { IoWarningSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {

  const navigate = useNavigate();
    
  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex md:items-center md:justify-center bg-primary w-full h-full'>
      <div className='flex flex-col items-center mx-auto p-3 md:p-0 md:justify-center text-white space-y-6 md:mb-[50px]'>
        <IoWarningSharp size={215}/> 
        <div className='text-center text-4xl font-bold'>404 Not Found</div>
        <div className='text-center text-xl'>This page does not exist</div>
        <div className='flex items-center'>
          <Link className='text-black py-3 px-4 bg-white font-semibold rounded-md' to={'/'}>Home</Link>
          <button className='text-grayText py-3 px-4 font-semibold hover:underline' onClick={goBack}>Go back</button>
        </div>
      </div>
    </div>
  )
}

export default NotFound