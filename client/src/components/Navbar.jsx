import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router'
import { AppContext } from '../context/AppContext.jsx'


const Navbar = () => {
    const { user, setShowLogin, logout } = useContext(AppContext)
    const navigate = useNavigate();
    return (

        <div className='flex items-center justify-between py-4'>
            <Link to='/'>
                <img src={assets.logo} alt="" className=' w-28 sm:w-32 lg:w-40' />
            </Link>
            <div>
                {
                    user ?
                        <div className='flex items-center gap-2 sm:gap-3'>
                            <p onClick={() => navigate('/community')} className='cursor-pointer text-gray-600 hover:text-black transition-colors mr-4 sm:mr-10'>My Creations</p>

                            <p className='text-gray-600 cursor-default'> Hi, {user.name}</p>
                            <div className='relative group cursor-pointer'>
                                <img src={assets.profile_icon} className='w-10 drop-shadow cursor-pointer ' />
                                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                    <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                                        <li onClick={logout}
                                            className='px-2 py-1 cursor-pointer pr-10'>Logout</li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                        :
                        <div className='flex items-center gap-2 sm:gap-5'>
                            <p onClick={() => navigate('/community')} className='cursor-pointer text-gray-600 hover:text-black transition-colors mr-4 sm:mr-10'>My Creations</p>
                            <button className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer'
                                onClick={() => setShowLogin(true)}

                            >Login</button>
                        </div>
                }


            </div>

        </div>
    )
}

export default Navbar