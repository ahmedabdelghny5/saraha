
import jwt from 'jsonwebtoken'
import { userModel } from '../DB/model/user.model.js';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            console.log({ authorization });
            if (!authorization?.startsWith("Hamada__")) {
                res.status(400).json({ message: "In-valid Bearer Key" })
            } else {
                const token = authorization.split('Hamada__')[1]
                console.log({ token });
                const decoded = jwt.verify(token, process.env.loginToken)
                if (!decoded?.id) {
                    res.json({ message: "In-valid  token payLoad" })
                } else {
                    const user = await userModel.findById(decoded.id).select("username email")
                    if (!user) {
                        res.status(401).json({ message: "In-valid  token user" })
                    } else {
                        req.user = user
                        next()
                    }

                }
            }
        } catch (error) {
            res.status(500).json({ message: "Catch error"})

        }

    }
}