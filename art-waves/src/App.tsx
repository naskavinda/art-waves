import { Outlet } from 'react-router'
import './App.css'
import { Navbar } from './components/Navbar/Navbar'

function App() {

  return (
    <>
    <Navbar/>
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
