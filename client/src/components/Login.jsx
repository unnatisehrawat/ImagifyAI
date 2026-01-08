import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext.jsx';
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify';
const Login = () => {

    const [state, setState] = useState('Login');
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Reset Password States
    const [resetOtp, setResetOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSumbitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', {
                    email, password
                })
                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            } else if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/user/register', {
                    name, email, password
                })
                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            } else if (state === 'Forgot Password') {
                const { data } = await axios.post(backendUrl + '/api/user/send-otp', { email });
                if (data.success) {
                    toast.success(data.message);
                    setState('Reset Password');
                } else {
                    toast.error(data.message);
                }
            } else if (state === 'Reset Password') {
                const { data } = await axios.post(backendUrl + '/api/user/reset-password', { email, otp: resetOtp, newPassword });
                if (data.success) {
                    toast.success(data.message);
                    setState('Login');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false);
        }
    }



    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])
    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form onSubmit={onSumbitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}

                className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back, please sign in to continue</p>

                {
                    state !== 'Login' && state !== 'Forgot Password' && state !== 'Reset Password' &&

                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.profile_icon} width={20} />
                        <input onChange={e => setName(e.target.value)} value={name}
                            type="text"
                            className='outline-none text-sm'
                            placeholder='Full Name' required />
                    </div>

                }

                {state !== 'Reset Password' &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.email_icon} />
                        <input onChange={e => setEmail(e.target.value)} value={email}
                            type="text"
                            className='outline-none text-sm'
                            placeholder='Email ID' required />
                    </div>
                }

                {state === 'Reset Password' &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.email_icon} />
                        <input type="text" className='outline-none text-sm' value={email} disabled />
                    </div>
                }

                {(state === 'Login' || state === 'Sign Up') &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                        <img src={assets.lock_icon} />
                        <input onChange={e => setPassword(e.target.value)} value={password}

                            type="password"
                            className='outline-none text-sm'
                            placeholder='Password' required />
                    </div>
                }

                {state === 'Reset Password' &&
                    <>
                        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                            <input onChange={e => setResetOtp(e.target.value)} value={resetOtp}
                                type="text"
                                className='outline-none text-sm'
                                placeholder='Enter OTP' required />
                        </div>
                        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                            <img src={assets.lock_icon} />
                            <input onChange={e => setNewPassword(e.target.value)} value={newPassword}
                                type="password"
                                className='outline-none text-sm'
                                placeholder='New Password' required />
                        </div>
                    </>
                }

                {state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer' onClick={() => setState('Forgot Password')}>Forgot Password ?</p>}

                <button className='bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer mt-4 display-block disabled:bg-blue-400 disabled:cursor-not-allowed' disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : (state === 'Login' ? 'Login' : state === 'Sign Up' ? 'Create Account' : state === 'Forgot Password' ? 'Send OTP' : 'Submit')}
                </button>

                {
                    (state === 'Login' || state === 'Sign Up') &&
                    (state === 'Login' ?
                        <p className='mt-5 text-center'>Don't have an account ?<span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}> Sign up</span>
                        </p>
                        :
                        <p className='mt-5 text-center'> Already have an account ?<span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}> Login </span>
                        </p>)
                }

                {(state === 'Forgot Password' || state === 'Reset Password') &&
                    <p className='mt-5 text-center'><span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}> Back to Login </span></p>
                }

                <img src={assets.cross_icon} alt=""
                    className='absolute top-5 right-5 cursor-pointer'
                    onClick={() => setShowLogin(false)} />
            </motion.form>

        </div>
    )
}

export default Login