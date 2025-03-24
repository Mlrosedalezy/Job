import React from 'react'
import router from './routes'
import { useRoutes } from 'react-router-dom'
import './utils/index.ts'

function App() {
  const element = useRoutes(router)

  return (
    <>
      <React.Suspense fallback={<div>Loading...</div>}>
        {element}
      </React.Suspense>
    </>
  )
}

export default App