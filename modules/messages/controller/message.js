import { messageModel } from "../../../DB/model/message.model.js";
import { userModel } from "../../../DB/model/user.model.js";
export const messageList = async (req, res) => {
    try {
        const message = await messageModel.find({ isDeleted: false }).populate([
            {
                path: 'reciverId',
                select: 'userName email profilePic',
                match: {
                    blocked: false
                }
            }
        ])
        const messageLis = message.filter(ele => {
            return ele.reciverId != null
        })
        res.json({ message: "Done", messageLis })
    } catch (error) {
        res.json({ message: "Catch error", error })
    }
}


export const sendMessages = async (req, res) => {
    try {
        const { reciverId } = req.params;
        const { message } = req.body
        const user = await userModel.findById(reciverId).select("userName")
        if (!user) {
            res.json({ message: "in-valid reciver " })
        } else {
            const newMessage = new messageModel({ text: message[0].message, reciverId })
            const savedMessage = await newMessage.save();
            res.json({ message: "Done", savedMessage })
        }
    } catch (error) {
        res.json({ message: "Catch error", error })
    }
}



export const softDeleteMessage = async (req, res) => {
    console.log("ukgiiu");
    const { id } = req.params;
    const userId = req.user._id;
    const message = await messageModel.updateOne({ _id: id, reciverId: userId },
        { isDeleted: true })
    message.modifiedCount ? res.json({ message: "Done" }) :
        res.json({ message: "In-valid message or u not auth" })
}
