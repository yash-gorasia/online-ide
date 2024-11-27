import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PlayGround from './components/PlayGround.jsx'
import FileDirectory from './components/FileDirectory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={< Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playground" element={<PlayGround />}/>
        <Route path='/file' element={<FileDirectory/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)
