import { FileText, Sparkle } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@clerk/react'

const ReviewResume = () => {

      const { getToken } = useAuth()
      const [input, setInput] = useState(null)
      const [result, setResult] = useState('')
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
      
      const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('')

        if (!input) {
          setError('Please upload a PDF resume.')
          return
        }

        try {
          setLoading(true)
          const token = await getToken()
          const formData = new FormData()
          formData.append('resume', input)

          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
          const response = await fetch(`${apiBase}/api/ai/review-resume`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          })

          const data = await response.json()
          if (!data.success) throw new Error(data.message || 'Failed to review resume.')
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
          <Sparkle className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>

        {/* Topic */}
        <p className='mt-6 text-sm font-medium'>Upload Resume</p>

        <input 
          type="file"
          accept='application/pdf'
          onChange={(e) => setInput(e.target.files[0])}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Support PDF Resume only</p>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
  <FileText className='w-5'/>
  {loading ? 'Reviewing...' : 'Review Resume'}
</button>
        {error && <p className='text-sm text-red-500 mt-3'>{error}</p>}

      </form>

      {/* Right Column  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
<div className='flex items-center gap-3'>
  <FileText className='w-5 h-5 text-[#00DA83]'/>
  <h1 className='text-xl font-semibold'>Analysis Results</h1>
</div>
<div className='flex-1 flex justify-center items-center p-2'>
  {result ? (
    <pre className='w-full text-xs sm:text-sm whitespace-pre-wrap text-slate-700 overflow-y-auto max-h-[450px]'>{result}</pre>
  ) : (
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
      <FileText className='w-9 h-9'/>
      <p>Upload a resume and click "Review Resume" to get started</p>
    </div>
  )}
</div>
</div>
 </div>
  )
}

export default ReviewResume