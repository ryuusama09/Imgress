import React from 'react'

const Loading = () => {
  console.log('Loading')
  return (
    <div className='h-full flex-grow flex justify-center'>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-32 w-32 border-8 border-b-sky-500 border-sky-300"></div>
        <h1>Loading</h1>
      </div>
    </div>
  )
}

export default Loading