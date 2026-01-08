import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";


export const createPost = async (req, res) => {
    try {
        const { userId, prompt, image } = req.body;

        if (!userId || !prompt || !image) {
            return res.json({ success: false, message: "Missing details" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const newPost = new postModel({
            userId,
            userName: user.name,
            prompt,
            image
        })

        await newPost.save();
        res.json({ success: true, message: "Post published to Community!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, posts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


