import { Scissors, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'

const RemoveObject = () => {
const { getToken } = useAuth()
const [input, setInput] = useState(null)
const [object, setObject] = useState('')
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

  if (!object.trim()) {
    setError('Please enter object name.')
    return
  }

  try {
    setLoading(true)
    const token = await getToken()
    if (!token) {
      throw new Error('Please sign in and try again.')
    }

    const formData = new FormData()
    formData.append('image', input)
    formData.append('object', object.trim())

    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
    const response = await fetch(`${apiBase}/api/ai/remove-object`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to remove object.')
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
          <Sparkle className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
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
        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>

        <textarea 
          rows={4}
          value={object}
          onChange={(e) => setObject(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g.,watch or spoon,Only single name'
       
          required
        />
       
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <Scissors className='w-5'/>
  {loading ? 'Processing...' : 'Remove Object'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
<div className='flex items-center gap-3'>
  <Scissors className='w-5 h-5 text-[#4A7AFF]'/>
  <h1 className='text-xl font-semibold'>Processed Image</h1>
</div>
<div className='flex-1 flex justify-center items-center'>
  {resultImage ? (
    <img src={resultImage} alt='Processed result' className='max-h-80 rounded-md object-contain' />
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <Scissors className='w-9 h-9'/>
      <p>Upload an image and click "Remove Object" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
   
  )
}

export default RemoveObject