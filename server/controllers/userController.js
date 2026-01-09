import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from "crypto";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'missing details' })
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await userModel.findOne({ email: normalizedEmail })
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token, user: { name: user.name } })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const normalizedEmail = email.toLowerCase().trim();

        console.log("Login attempt for:", normalizedEmail);

        const user = await userModel.findOne({ email: normalizedEmail })
        if (!user) {
            console.log("User not found in DB");
            return res.json({ success: false, message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            res.json({ success: true, token, user: { name: user.name } })
        } else {
            console.log("Invalid credentials");
            return res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const userCredits = async (req, res) => {

    try {
        const { userId } = req.body
        console.log("User Credits request for userId:", userId);

        const user = await userModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }

}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        user.resetOtp = hashedOtp;
        user.resetOtpExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. Use this to reset your password.`
        };

        console.log("Attempting to send OTP email...");
        const startTime = Date.now();

        await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully in ${Date.now() - startTime}ms`);

        res.json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        console.log("Email error:", error);
        res.json({ success: false, message: "Failed to send OTP. Please try again later." });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.json({ success: false, message: "Missing details" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Verify OTP - Hash the incoming OTP and compare
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        if (user.resetOtp === '' || user.resetOtp !== hashedOtp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpire < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpire = 0;

        await user.save();

        res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
