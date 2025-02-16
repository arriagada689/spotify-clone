import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

const MainLayout = () => {
    return (
        <div className='h-screen md:p-2 bg-black overflow-y-hidden'>
            <SideBar />
            
            <div className='md:ml-[375px] pb-16 md:pb-0 flex flex-col h-full overflow-x-hidden md:rounded-b-lg custom-scrollbar'>
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout
