import dotenv from 'dotenv'
dotenv.config()
import * as indexRouter from './modules/index.router.js'
import express from 'express'
import connectDB from './DB/connection.js'
const app = express()
const port = 3000
const baseUrl = process.env.BASEURL

app.use(express.json())
app.use(`${baseUrl}/upload`, express.static('./upload'))
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/message`, indexRouter.messageRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)

app.use("*", (req, res) => {
    res.json({ message: "In-valid Routing" })
})
connectDB()
app.listen(port, () => console.log(`Server running on port .......${port}`))