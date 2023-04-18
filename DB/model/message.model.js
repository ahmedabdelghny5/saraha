import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema({
    text: { type: String, required: true },
    reciverId: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }

}, {
    timestamps: true
})

export const messageModel = model('Message', messageSchema)