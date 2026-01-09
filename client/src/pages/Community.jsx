import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCreations = () => {
    const { user } = useContext(AppContext)
    const [creations, setCreations] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchCreations = () => {
        try {
            const data = JSON.parse(localStorage.getItem('creations') || '[]')
            setCreations(data)
        } catch (error) {
            toast.error("Error loading creations")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCreations()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='min-h-screen mb-16'
        >
            <h1 className='text-3xl sm:text-4xl font-semibold text-center mb-10 text-neutral-800 mt-10'>My Creations</h1>
            <p className='text-center text-gray-500 mb-12 max-w-xl mx-auto'>Your personal gallery of AI-generated masterpieces. All images are stored locally in your browser for privacy and speed.</p>


            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 px-4 sm:px-10'>
                    {creations.map((item, index) => (
                        <div key={index} className='break-inside-avoid relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                            <img src={item.image} alt={item.prompt} className='w-full object-cover' loading="lazy" />
                            <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white'>
                                <p className='font-medium text-sm mb-1 line-clamp-2'>"{item.prompt}"</p>
                                <div className='flex items-center gap-2 mt-2'>
                                    <div className='w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs'>
                                        {user?.name?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <span className='text-xs text-gray-300'>{user?.name || 'You'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && creations.length === 0 && (
                <p className='text-center text-gray-500 mt-20'>No creations yet. Start generating to build your gallery!</p>
            )}
        </motion.div>
    )
}

export default MyCreations
