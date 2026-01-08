import userModel from "../models/userModel.js"
import FormData from 'form-data'
import axios from 'axios'
export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body
    const user = await userModel.findById(userId)
    if (!user || !prompt) {
      return res.json({ success: false, message: "missing details" })
    }
    const formData = new FormData()
    formData.append('prompt', prompt)

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API,
      }, responseType: 'arraybuffer'
    })
    const base64Image = Buffer.from(data, 'binary').toString('base64')
    const resultImage = `data:image/png;base64,${base64Image}`

    // Credit deduction removed for Community Edition
    // await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

    res.json({
      success: true, message: 'image generated', creditBalance: user.creditBalance, resultImage
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}