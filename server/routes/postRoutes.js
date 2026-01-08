import express from 'express'
import { createPost, getAllPosts } from '../controllers/postController.js'
import userAuth from '../middleware/auth.js'

const postRouter = express.Router()

postRouter.post('/create', userAuth, createPost)
postRouter.get('/all', getAllPosts)

export default postRouter
