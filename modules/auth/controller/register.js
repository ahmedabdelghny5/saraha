import { userModel } from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import { myEmail } from "../../../services/email.js"
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

// https://web.whatsapp.com/
export const signup = async (req, res) => {
    try {
        const { email, name, password } = req.body
        const user = await userModel.findOne({ email }).select('email')
        // user="kjkk"

        if (user) {
            res.status(StatusCodes.CONFLICT).json({ message: "Email exist" , error: getReasonPhrase(StatusCodes.CONFLICT) })
        } else {
            const hashPassword = await bcrypt.hash(password, parseInt(process.env.SaltRound))
            const newUser = new userModel({ email, userName: name, password: hashPassword })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.emailToken,
                { expiresIn: 60 * 60 })
    
            const rfToken = jwt.sign({ id: savedUser._id }, process.env.emailToken,)
            const link =
                `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const linkrf =
                `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refToken/${rfToken}`
    
            myEmail(email,
                'ConfirmationEmail',
                `<a href='${link}'>Follow me to confirm u account</a> <br>
                 <a href='${linkrf}'>Re-send confirmation email</a>`)
            savedUser ? res.status(StatusCodes.CREATED).json({ message: "Done" }) : res.status(400).json({ message: "Fail to signup" })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "catch error" , error })
    }
   
}

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            res.json({ message: "in-valid token" })
        } else {
            const decoded = jwt.verify(token, process.env.emailToken)
            if (!decoded?.id) {
                res.json({ message: "in-valid token payload" })
            } else {
                const user = await userModel.updateOne({
                    _id: decoded.id,
                    confirmEmail: false
                },
                    { confirmEmail: true })
                user.modifiedCount ? res.json({ message: "Done plz procced to login page" }) :
                    res.json({ message: " Already confirmed" })
            }
        }
    } catch (error) {
        res.json({ message: "catch error", error })

    }

}



export const refreshEmail = async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded?.id) {
        res.json({ message: "in-valid token payload" })
    } else {
        const user = await userModel.findById(decoded.id).select('email confirmEmail')
        if (!user) {
            res.json({ message: "not register account" })
        } else {
            if (user.confirmEmail) {
                res.json({ message: "Already confirmed" })
            } else {
                const token = jwt.sign({ id: user._id }, process.env.emailToken,
                    { expiresIn: 60 * 5 })
                const link =
                    `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`

                myEmail(user.email,
                    'ConfirmationEmail',
                    `<a href='${link}'>Follow me to confirm u account</a> `)
                res.json({ message: "Done" })
            }
        }
    }

}

export const signin = async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        res.status(404).json({ message: "In-valid account" })
    } else {
        if (!user.confirmEmail) {
            res.status(400).json({ message: "Plz confirm u email first" })
        } else {
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                res.json({ message: "In-valid account password" })
            } else {
                const token = jwt.sign({ id: user._id, isLoggedIn: true },
                    process.env.loginToken, { expiresIn: 60 * 60 * 24 })
                await userModel.updateOne({ _id: user._id }, { online: true })
                res.status(200).json({ message: "Done", token })
            }
        }
    }
}


export const sendCode = async (req, res) => {

    const { email } = req.body;
    const user = await userModel.findOne({ email }).select('email')
    if (!user) {
        res.json({ message: "In-valid Account" })
    } else {
        // const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000) //9787
        const code = nanoid()
        myEmail(email, 'Forget password', `<h1>Access code : ${code}</h1>`)
        const updatedUser = await userModel.updateOne({ _id: user._id }, { code })
        updatedUser.modifiedCount ? res.json({ message: "Done" }) : res.json({ message: "Fail" })
    }
}


export const forgetPassword = async (req, res) => {
    const { code, newPassword, email } = req.body
    if (code == null) {
        res.json({ message: "In-valid code  null not accepted" })
    } else {
        const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound))
        const user = await userModel.updateOne({ email, code },
            { password: hashPassword, code: null })
        user.modifiedCount ? res.json({ message: "Done" }) :
            res.json({ message: "In-valid code" })
    }
}