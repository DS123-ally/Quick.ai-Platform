import React, { useEffect, useState } from 'react'
import { GemIcon, Sparkles } from 'lucide-react'
import CreationItem from '../components/CreationItem'
import { useAuth } from '@clerk/react'
import { fetchJson } from '../utils/fetchJson'

const Dashboard = () => {

  const [creations, setCreations] = useState([])
  const { getToken } = useAuth()

  const getDashboardData = async () => {
    try {
      const token = await getToken()
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
      const { ok, data } = await fetchJson(`${apiBase}/api/ai/creations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (ok && data.success) {
        setCreations(data.creations || [])
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteCreation = async (id) => {
    const confirmed = window.confirm('Delete this creation?')
    if (!confirmed) return

    try {
      const token = await getToken()
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
      const { ok, data } = await fetchJson(`${apiBase}/api/ai/creations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (ok && data.success) {
        setCreations((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDashboardData()
  }, [])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        
        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm'>
          
          <div>
            <p className='text-gray-500'>Total Creations</p>
            <h2 className='text-2xl font-bold'>{creations.length}</h2>
          </div>

          <div className='bg-purple-100 p-3 rounded-lg'>
            <Sparkles className='w-5 text-purple-600'/>
          </div>

        </div>

         {/* Active Plan  Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm'>
          
          <div>
            <p className='text-gray-500'>Active Plan</p>
            <h2 className='text-2xl font-bold'>Premium</h2>
          </div>

          <div className='bg-purple-100 p-3 rounded-lg'>
            <GemIcon className='w-5 text-blue-600'/>
          </div>

        </div>

      </div>

      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations

        </p>
        { 
        creations.map((item)=> <CreationItem key={item.id} item={item} onDelete={handleDeleteCreation} />)

        }

      </div>
    </div>
  )
}

export default Dashboard