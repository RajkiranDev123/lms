import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import { UserModel } from "../models/userModel.js";


export const isAuthenticated = catchAsyncErrors(
    async (req, res, next) => {

      
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ErrorHandler("Unauthorized: No token provided", 401));
        }
        const token = authHeader.split(" ")[1];

        console.log("Extracted token ==> ", token)

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log("from isAuthenticated==>", decoded)
        // req.user=decoded
        req.user = await UserModel.findById(decoded?.id).select("-resetPasswordToken -resetPasswordExpire -verificationCode -verificationCodeExpire")
        console.log("user from auth middleqware==>", req.user)

        if (!req.user) {
            return next(new ErrorHandler("User not found.", 404));
        }
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