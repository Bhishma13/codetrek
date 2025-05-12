import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserInput from './components/UserInput'
import Dashboard from './components/Dashboard'
import About from './components/About'
import Performance from './components/Performance' 
import ComparePerformance from './components/ComparePerformance'
import CompareWithOthers from './components/CompareWithOthers'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/enter-handle' element={<UserInput/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/performance/:handle' element={<Performance />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/compare/:handle' element={<ComparePerformance/>}/>
        <Route path='/compareWithOthers/:handle1/:handle2'element ={<CompareWithOthers/>}/>
      </Routes>
    </Router>
  )
}

export default App
