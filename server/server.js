import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import postRouter from "./routes/postRoutes.js"

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({ origin: ["https://imagify-ai-orpin.vercel.app", "https://imagify-ai-orpin.vercel.app/", "http://localhost:5173"] }))

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/posts', postRouter)

app.get('/', (req, res) => {
    res.send(" API working fine")
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("server running on port " + PORT)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
