import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true },
    fName: { type: String },
    lame: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female'], default: "Male" },
    confirmEmail: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    profilePic: String,
    coverPics: Array,
    password: { type: String, required: true },
    code: { type: String, default: null }


}, {
    timestamps: true
})

export const userModel = model('User', userSchema)