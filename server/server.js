import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import postRouter from "./routes/postRoutes.js"

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(cors({ origin: "*" }))

// Diagnostic Logger - Place BEFORE routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} | Content-Type: ${req.headers['content-type']} | Size: ${req.headers['content-length'] || 0} bytes`);
    next();
});

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/posts', postRouter)

app.get('/', (req, res) => {
    res.send(" API working fine")
})

const startServer = async () => {
    try {
        await connectDB();

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error("Global Error Handler:", err.name, err.message);
            if (err.name === 'PayloadTooLargeError') {
                return res.status(413).json({ success: false, message: "Image too large for server limits." });
            }
            res.status(500).json({ success: false, message: err.message });
        });

        app.listen(PORT, () => {
            console.log("server running on port " + PORT)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
