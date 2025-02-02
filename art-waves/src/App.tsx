import { Outlet } from 'react-router'
import './App.css'

function App() {

  return (
    <>
      <main>
        <Outlet/>
      </main>
      <div className="text-3xl text-red-500">
        Hi world!
      </div>
    </>
  )
}

export default App
