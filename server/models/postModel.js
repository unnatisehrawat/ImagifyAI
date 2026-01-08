import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String }, 
    prompt: { type: String, required: true },
    image: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
})

const postModel = mongoose.models.post || mongoose.model("post", postSchema)

export default postModel;
