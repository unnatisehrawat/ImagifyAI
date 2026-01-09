
import React, { useContext } from 'react'
import Home from './pages/Home'

import Result from './pages/Result'
import MyCreations from './pages/Community'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext.jsx'
import { ToastContainer } from 'react-toastify';
const App = () => {

  const { showLogin } = useContext(AppContext)
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-linear-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />

        <Route path="/community" element={<MyCreations />} />


      </Routes>
      <Footer />
    </div>
  )
}

export default App
