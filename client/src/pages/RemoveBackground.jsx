import { Eraser, Sparkle } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'
import { fetchJson } from '../utils/fetchJson'

const RemoveBackground = () => {
    const { getToken } = useAuth()
    const [input, setInput] = useState(null)
    const [resultImage, setResultImage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const onSubmitHandler = async (e) => {
      e.preventDefault()
      setError('')

      if (!input) {
        setError('Please upload an image.')
        return
      }

      try {
        setLoading(true)
        const token = await getToken()
        const formData = new FormData()
        formData.append('image', input)

        const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
        const { ok, data } = await fetchJson(`${apiBase}/api/ai/remove-background`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })

        if (!ok || !data.success) {
          throw new Error(data.message || 'Failed to remove background.')
        }
        setResultImage(data.content)
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

  return (
   <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left column */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>

        <div className='flex items-center gap-3'>
          <Sparkle className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>

        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Upload image</p>

        <input 
          type="file"
          accept='image/*'
          onChange={(e) => setInput(e.target.files[0])}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Support JPG,PNG,and other image formats</p>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <Eraser className='w-5'/>
  {loading ? 'Processing...' : 'Remove Background'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
<div className='flex items-center gap-3'>
  <Eraser className='w-5 h-5 text-[#FF4938]'/>
  <h1 className='text-xl font-semibold'>Processed Image</h1>
</div>
<div className='flex-1 flex justify-center items-center'>
  {resultImage ? (
    <img src={resultImage} alt='Background removed result' className='max-h-80 rounded-md object-contain' />
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <Eraser className='w-9 h-9'/>
      <p>Upload an image and click "Remove Background" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
  )
}

export default RemoveBackground