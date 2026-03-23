import { EditIcon, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setError('')

    if (!input.trim()) {
      setError('Please enter article topic.')
      return
    }

    try {
      setLoading(true)
      const token = await getToken()
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${apiBase}/api/ai/generate-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: `${input.trim()} | target length: ${selectedLength.length} words`
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Failed to generate article.')
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
          <Sparkles className='w-6 text-blue-600' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Article Topic</p>

        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is...'
          required
        />

        {/* Length */}
        <p className='mt-4 text-sm font-medium'>Article Length</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:w-9/12'>
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-gray-500 border-gray-300'
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br/>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <EditIcon className='w-5'/>
  {loading ? 'Generating...' : 'Generate article'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
<div className='flex items-center gap-3'>
  <EditIcon className='w-5 h-5 text-cyan-300'/>
  <h1 className='text-xl font-semibold'>Generated Article</h1>
</div>
<div className='flex-1 flex justify-center items-center p-2'>
  {result ? (
    <pre className='w-full text-xs sm:text-sm whitespace-pre-wrap text-slate-700 overflow-y-auto max-h-[450px]'>{result}</pre>
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <EditIcon className='w-9 h-9'/>
      <p>Enter a topic and click "Generate article" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
  )
}

export default WriteArticle