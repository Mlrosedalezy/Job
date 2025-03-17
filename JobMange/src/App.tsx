import { Suspense } from 'react'
import './App.css'
import routes from './routers/index'
import { useRoutes } from 'react-router-dom'

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <Suspense fallback={<div>加载中...</div>}>
        {element}
      </Suspense>
    </>
  )
}

export default App
