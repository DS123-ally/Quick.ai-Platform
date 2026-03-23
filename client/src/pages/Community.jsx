import { useUser } from '@clerk/react'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCreations()
    }
  }, [user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className="text-lg font-semibold">Creations</h2>

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        
        {creations.map((creation, index) => (
          <div
            key={index}
            className='relative group w-full transition-transform duration-300 hover:scale-[1.02]'
          >
            
            <img
              src={creation.content}
              alt=""
              className='w-full aspect-[3/2] object-cover rounded-xl'
            />

            <div className='absolute inset-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent via-black/20 to-black/60 text-white rounded-xl'>
              
              <p className='text-xs sm:text-sm font-medium hidden group-hover:block'>
                {creation.prompt}
              </p>

              <div className='flex gap-1 items-center'>
                <p className="text-xs">{creation.likes.length}</p>

                <Heart
                  className={`min-w-5 h-5 hover:scale-110 transition cursor-pointer ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Community