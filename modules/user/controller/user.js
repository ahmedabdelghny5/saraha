import { messageModel } from "../../../DB/model/message.model.js"
import { userModel } from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
export const profile = async (req, res) => {
    const user = await userModel.findById(req.user._id)
    res.json({ message: "User Module", user })
}


export const userMessage = async (req, res) => {
    const messages = await messageModel.find({ reciverId: req.user._id, isDeleted: false })

    res.json({ message: "User Module", messages })
}


export const getShareProfile = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select("userName email profilePic")
    user ? res.json({ message: "Done", user }) : res.json({ message: "In-valid account" })

}



export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await userModel.findById(req.user._id)
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            res.json({ message: "In-valid Old Password" })
        } else {

            const newHash = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound))
            const updatedUser = await userModel.updateOne({ _id: user._id },
                 { password: newHash })
            updatedUser.modifiedCount ? res.json({ message: "Done" }) 
            : res.json({ message: "Fail in update Password" })
        }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
}