import { Router } from "express";
import { auth } from "../../middelwear/auth.js";
import {  validation } from "../../middelwear/validation.js";
import * as validators from './message.validation.js'
import * as Rc  from './controller/message.js'
const router  = Router()

router.get("/", Rc.messageList)

router.post("/:reciverId",validation(validators.sendMessage ) ,Rc.sendMessages)
router.patch("/:id", auth(),Rc.softDeleteMessage)

export default router