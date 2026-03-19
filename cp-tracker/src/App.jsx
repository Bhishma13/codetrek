import { useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import UserInput from './components/UserInput'
import Dashboard from './components/Dashboard'
import About from './components/About'
import Performance from './components/Performance'
import ComparePerformance from './components/ComparePerformance'
import CompareWithOthers from './components/CompareWithOthers'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = ({ auth, setAuth }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Home auth={auth} /></PageWrapper>} />
        <Route path='/enter-handle' element={<PageWrapper><UserInput /></PageWrapper>} />
        <Route path='/dashboard' element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path='/performance/:handle' element={<PageWrapper><Performance /></PageWrapper>} />
        <Route path='/about' element={<PageWrapper><About /></PageWrapper>} />
        <Route path='/compare/:handle' element={<PageWrapper><ComparePerformance /></PageWrapper>} />
        <Route path='/compareWithOthers/:handle1/:handle2' element={<PageWrapper><CompareWithOthers /></PageWrapper>} />
        <Route path='/signin' element={<PageWrapper><SignIn setAuth={setAuth} /></PageWrapper>} />
        <Route path='/signup' element={<PageWrapper><SignUp setAuth={setAuth} /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [auth, setAuth] = useState(null);

  return (
    <Router>
      <Navbar auth={auth} setAuth={setAuth} />
      <AnimatedRoutes auth={auth} setAuth={setAuth} />
    </Router>
  )
}

export default App
