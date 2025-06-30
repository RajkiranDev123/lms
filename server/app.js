//all installations and configs
import express from "express"
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDB } from "./db/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRouter.js"
import bookRouter from "./routes/bookRouter.js"
import borrowRouter from "./routes/borrowRoutes.js"
import userRouter from "./routes/userRouter.js"


import expressFileupload from "express-fileupload"
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

export const app = express()

config({ path: "./.env" })
app.use(cors())
app.use(cookieParser())

// only works on data not files
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//

app.use(expressFileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/book", bookRouter)
app.use("/api/v1/borrow", borrowRouter)
app.use("/api/v1/user", userRouter)


// notifyUsers()


// removeUnverifiedAccounts()




connectDB()
app.use(errorMiddleware)