import express from 'express'
import { createPost, getAllPosts } from '../controllers/postController.js'
import userAuth from '../middleware/auth.js'

const postRouter = express.Router()

postRouter.post('/create', userAuth, createPost)
postRouter.get('/all', getAllPosts)
postRouter.get('/test', (req, res) => res.json({ success: true, message: "Post Router is active" }))

export default postRouter
