import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { X, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useUser } from '@clerk/react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user, isLoaded } = useUser()

  if (!isLoaded) return null

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-xl text-gray-600'>Please sign in to continue</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-b-gray-200'>
        <img 
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44 cursor-pointer"
          onClick={() => navigate('/')}
        />

        {
          sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
            : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>

      <div className='flex-1 w-full flex h-[calc(100vh-56px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout