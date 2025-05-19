import { Outlet } from '@tanstack/react-router'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  )
}

export default App