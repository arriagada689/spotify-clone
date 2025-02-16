import React from 'react'
import { useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Oval } from 'react-loader-spinner'
import { FaSpotify } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { loginUser } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        if (response.ok){
          const data = await response.json()
          
          loginUser(data);
          navigate('/')
        } else {
          const error = await response.json()
          throw new Error(error.message)
        }
  
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage(error.message)
      }
      setLoading(false)
    }
    
    return loading ? (
      <div className='flex justify-center bg-primary w-full h-full pt-5'>
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
    ) : (
      <div className='flex bg-primary w-full h-full pt-4 md:pt-0 md:items-center justify-center'>
          <div className='flex flex-col text-grayText md:mb-[50px] space-y-4 w-2/3 lg:w-1/2 xl:w-1/3'>
            <FaSpotify size={200} className='mx-auto text-white'/>
            <div className='text-center text-4xl font-bold text-white'>Log In</div>
            {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
            <Form onSubmit={ submitHandler }>
              <div className='flex flex-col space-y-2 mb-2'>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" 
                  required
                  className='border border-gray-400 bg-primary rounded-md p-2 w-full'
                />
              </div>
              <div className='flex flex-col space-y-2 mb-4'>
                <label htmlFor="password">Password:</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className='border border-gray-400 bg-primary rounded-md p-2 w-full'
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center">
                    {showPassword ? <IoMdEye size={20}/> : <IoMdEyeOff size={20}/>}
                  </button>
                </div>
              </div>
              <div className='flex justify-center'>
                <button type="submit" className='bg-spotifyGreen w-fit text-white text-lg py-2 px-3 rounded-lg mb-4 font-semibold'>Log In</button>
              </div>

              <div className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-500 underline' >Sign up</Link> </div>
            </Form>
          </div>
      </div>
    )
}

export default Login