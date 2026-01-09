import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import App from '../App';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify'


const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { generateImage, backendUrl, token } = useContext(AppContext)

  const compressImage = (base64Str, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to highly compressed JPEG
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (input) {
      setLoading(true);
      const newImage = await generateImage(input)
      if (newImage) {
        setIsImageLoaded(true)
        setImage(newImage)
      }
    }
    setLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}

      onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center '>
      <div>
        <div className='relative'>
          <img src={image} alt="" className='max-w-sm rounded' />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 
           ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}
          />

        </div>
        <p className={!loading ? 'hidden' : " "}>loading....</p>
      </div>
      {!isImageLoaded &&
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input type="text"
            onChange={e => setInput(e.target.value)} value={input}

            placeholder='Describe what you want to generate'
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 ' />
          <button type="submit"
            className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
        </div>
      }
      {isImageLoaded &&
        <div className='flex flex-wrap gap-2 justify-center text-white text-sm p-0.5 mt-10 rounded-full '>
          <p className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'
            onClick={() => { setIsImageLoaded(false) }}
          >Generate another </p>
          <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>
            Download</a>
          <button className='bg-indigo-600 px-10 py-3 rounded-full cursor-pointer hover:scale-105 transition-all'
            onClick={async () => {
              try {
                toast.info("Saving to your creations...")
                const compressedImage = await compressImage(image);

                // Save to LocalStorage
                const existingCreations = JSON.parse(localStorage.getItem('creations') || '[]');
                const newCreation = {
                  _id: Date.now().toString(),
                  image: compressedImage,
                  prompt: input,
                  createdAt: new Date().toISOString()
                };

                localStorage.setItem('creations', JSON.stringify([newCreation, ...existingCreations]));

                toast.success("Saved to My Creations!")
              } catch (error) {
                toast.error("Failed to save. Storage might be full.")
              }
            }}>Save to Creations</button>
        </div>
      }
    </motion.form >
  )
}

export default Result