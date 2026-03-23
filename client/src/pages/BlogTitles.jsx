import { Hash, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'

const BlogTitles = () => {

    const blogCategories= [
      'General' ,'Technology','Business','Health','Lifestyle','Education','Travel','Food'
    ]
  
    const [selectedCategory, setSelectedCategory] = useState('General')
    const [input, setInput] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { getToken } = useAuth()

    const onSubmitHandler = async (e) => {
      e.preventDefault()
      setError('')

      if (!input.trim()) {
        setError('Please enter a keyword.')
        return
      }

      try {
        setLoading(true)
        const token = await getToken()
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

        const response = await fetch(`${apiBase}/api/ai/generate-blog-title`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            prompt: `${input.trim()} | category: ${selectedCategory}`
          })
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.message || 'Failed to generate title.')
        setResult(data.content)
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
          <Sparkle className='w-6 text-green-400' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Keyword</p>

        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is...'
          required
        />

        {/* Length */}
        <p className='mt-4 text-sm font-medium'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:w-9/12'>
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${selectedCategory === item
                  ? 'bg-purple-50 text-purple-700 border-blue-300'
                  : 'text-gray-500 border-gray-300'
                }`}
            >
              {item}
            </span>
          ))}
        </div>
        <br/>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <Hash className='w-5'/>
  {loading ? 'Generating...' : 'Generate title'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
<div className='flex items-center gap-3'>
  <Hash className='w-5 h-5 text-[#8E37EB]'/>
  <h1 className='text-xl font-semibold'>Generated titles</h1>
</div>
<div className='flex-1 flex justify-center items-center'>
  {result ? (
    <p className='text-lg font-medium text-slate-700'>{result}</p>
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <Hash className='w-9 h-9'/>
      <p>Enter a topic and click "Generate title" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
  )
}

export default BlogTitles