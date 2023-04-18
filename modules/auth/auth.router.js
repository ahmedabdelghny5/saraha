import { Router } from "express";
import { auth } from "../../middelwear/auth.js";
import { validation } from "../../middelwear/validation.js";
import * as validators from './auth.validation.js'
import * as rgister from './controller/register.js'
const router  = Router()





router.post("/signup" ,validation(validators.signup) ,rgister.signup)

router.get('/confirmEmail/:token' ,validation(validators.checkToken) ,rgister.confirmEmail)
router.get('/refToken/:token' , rgister.refreshEmail)

router.post("/signin" ,validation(validators.signin) ,rgister.signin)


router.patch("/sendCode" , rgister.sendCode)
router.patch("/forgetPassword" , rgister.forgetPassword)






export default router