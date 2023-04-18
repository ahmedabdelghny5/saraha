import multer from 'multer'
import { nanoid } from 'nanoid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// import d from '../upload'

export const multerValidation = {
    image: ['image/jpeg', 'image/png', 'image/jif'],
    pdf: ['application/pdf'],

}


export const HME = (err, req, res, next) => {

    if (err) {
        res.status(400).json({ message: "Multer error", err })
    } else {
        next()
    }

}
export function myMulter(customPath, customValidation) {
    console.log(__dirname);
    if (!customPath) {
        customPath = 'general'
    }

    if (!customValidation) {
        customValidation = multerValidation.image
    }
    const fullPath = path.join(__dirname, `../upload/${customPath}`)
    console.log({ fullPath });
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, `upload/${customPath}`)
        },
        filename: function (req, file, cb) {
            console.log(file);
            cb(null, nanoid() + "_" + file.originalname)
        }
    })
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('In-valid format', false)
        }

    }
    const upload = multer({ dest: fullPath, fileFilter, storage })
    return upload
}