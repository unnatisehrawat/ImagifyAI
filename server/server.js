import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import postRouter from "./routes/postRoutes.js"

const PORT = process.env.PORT || 4000
const app = express()

// 1. Precise Body Parsers (Higher Limits)
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

// 2. Permissive CORS for Debugging
app.use(cors({ origin: "*" }))

// 3. Diagnostic Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} | Size: ${req.headers['content-length'] || 0} bytes`);
    next();
});

// 4. Routes
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/posts', postRouter)

app.get('/', (req, res) => {
    res.send(" API working fine")
})

// 5. Catch-all 404 handler (Logs failures)
app.use((req, res, next) => {
    console.log(`404: Endpoint Not Found -> ${req.method} ${req.url}`);
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

const startServer = async () => {
    try {
        await connectDB();

        // 6. Global Error Handler for Payload and Network Errors
        app.use((err, req, res, next) => {
            console.error("Critical Error:", err.name, err.message);
            if (err.name === 'PayloadTooLargeError') {
                return res.status(413).json({ success: false, message: "Request chunk too large." });
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
