import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import { UserModel } from "../models/userModel.js";


export const isAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
        const { token } = req.cookies
        if (!token) return next(new ErrorHandler("User is not authenticated!", 400))
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log("from isAuthenticated==>", decoded)
        // req.user=decoded
        req.user = await UserModel.findById(decoded?.id)

        next()


    }
)


export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`User with this role (${req.user.role}) not allowed to access this resource!`, 400))
        }
        next()
    }
}