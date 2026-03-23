import { Image, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'

const GenerateImages = () => {

  const imageStyle= [
       'Realistic','Ghibili style','Anime style','Cartoon style','Fantasy style','Realistic style','3D style','Portrait style'
      ]
    
      const [selectedStyle, setSelectedStyle] = useState('Realistic')
      const [input, setInput] = useState('')
      const [publish,setPublish]=useState(false)
      const [resultImage, setResultImage] = useState('')
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
      const { getToken } = useAuth()

      const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('')

        if (!input.trim()) {
          setError('Please enter image prompt.')
          return
        }

        try {
          setLoading(true)
          const token = await getToken()
          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

          const response = await fetch(`${apiBase}/api/ai/generate-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              prompt: `${input.trim()} | style: ${selectedStyle}`,
              publish
            })
          })

          const data = await response.json()
          if (!data.success) throw new Error(data.message || 'Failed to generate image.')
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
          <Sparkle className='w-6 text-red-400' />
          <h1 className='text-xl font-semibold'>AI Image Generator </h1>
        </div>

        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>

        <textarea 
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image..'
       
          required
        />

        {/* Length */}
        <p className='mt-4 text-sm font-medium'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:w-9/12'>
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${selectedStyle === item
                  ? 'bg-green-50 text-green-700 border-blue-300'
                  : 'text-gray-500 border-gray-300'
                }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type='checkbox' onChange={(e)=>setPublish(e.target.checked)} checked={publish}  className='sr-only peer'></input>
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'>
            </div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>
        <br/>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <Image className='w-5'/>
  {loading ? 'Generating...' : 'Generate Image'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
<div className='flex items-center gap-3'>
  <Image className='w-5 h-5 text-[#00AD25]'/>
  <h1 className='text-xl font-semibold'>Generated image</h1>
</div>
<div className='flex-1 flex justify-center items-center'>
  {resultImage ? (
    <img src={resultImage} alt='Generated result' className='max-h-80 rounded-md object-contain' />
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <Image className='w-9 h-9'/>
      <p>Enter a topic and click "Generate Image" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
    
  )
}

export default GenerateImages