import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {

    const navigate=useNavigate()
  return (
   <section
      className="
        min-h-screen
        px-4 sm:px-20 xl:px-32
        flex flex-col items-center justify-center
        text-center
        bg-cover bg-no-repeat bg-center
        pt-20
      "
      style={{backgroundImage: `url(${assets.gradientBackground})`}}


    >
    <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>Create Amazing Content  <br/>With <span className='text-blue-500'>AI Tools</span></h1>
        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>
            Transform your content creation with pour suite of premium AI tools.Write articles,generate images,and enchance your workflow.
        </p>
    </div>
    <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
        <button onClick={()=>navigate('/ai')} className='bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition cursor-pointer'>Start creating now</button>
        <button className='bg-gray-700 text-white px-10 py-3 rounded-lg border border-gray-300 hover:bg-gray-800 active:scale-95 transition cursor-pointer'>Watch Demo</button>
    </div>
    <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
        <img src={assets.user_group} alt="" className='h-8 '/>Trusted by 10k+ People
    </div>

    </section>
   
  )
}

export default Hero