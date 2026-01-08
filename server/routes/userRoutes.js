import express from 'express'
import { registerUser, loginUser, userCredits, sendResetOtp, resetPassword } from '../controllers/userController.js'
import userAuth from '../middleware/auth.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/send-otp', sendResetOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/credits', userAuth, userCredits)

export default userRouter