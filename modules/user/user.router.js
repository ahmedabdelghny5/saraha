import { Router } from "express";
import * as uc from './controller/user.js'
import { auth } from "../../middelwear/auth.js";
import { validation } from "../../middelwear/validation.js";
import * as validators from './user.validation.js'
import { HME, multerValidation, myMulter } from "../../services/multer.js";
const router = Router()



router.patch("/profile/pic", myMulter('user/cover',multerValidation.image).single('image'),HME ,(req, res) => {
    res.status(200).json({ message: "Done", fil: req.file })
})

router.get("/profile/share/:id", uc.getShareProfile)
router.get("/profile", auth(), uc.profile)
router.get("/message", validation(validators.checktoken), auth(), uc.userMessage)

router.patch('/password', auth(), uc.updatePassword)


export default router