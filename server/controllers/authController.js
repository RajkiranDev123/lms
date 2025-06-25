import ErrorHandler from "../middlewares/errorMiddleware.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { UserModel } from "../models/userModel.js"
import bcrypt from "bcrypt"
import crypto from "crypto"

import { sendVerificationCode } from "../utils/sendVerificationCode.js"
import { sendToken } from "../utils/sendToken.js"

export const register = catchAsyncErrors(

    async (req, res, next) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return next(new ErrorHandler("All fields are required!", 400))
            }

            const isRegistered = await UserModel.findOne({ email, accountVerified: true })

            if (isRegistered) return next(new ErrorHandler("User Already exists!", 400))

            const registrationAttempts = await UserModel.find({
                email, accountVerified: false
            })

            if (registrationAttempts.length >= 5) return next(new ErrorHandler("Exceeded Registration attepmts,Contact Admin!", 400))

            if (password.length < 5 || password.length > 16) {
                return next(new ErrorHandler("Password must be between 8 & 16 characters!", 400))
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword
            })
            const verificationCode = await user.generateVerificationCode()
            await user.save()
            sendVerificationCode(verificationCode, email, res)
            // res.status(200).json({
            //     success: true,
            //     message: "User Created Successfully!"
            // })
        } catch (error) {
            next(error)
        }

    }, console.log("register is called!")
)

//////////////////////////////////////////////////// verify otp //////////////////////////////////////////

export const verifyOtp = catchAsyncErrors(
    async (req, res, next) => {
        const { email, otp } = req.body
        if (!email || !otp) return next(new ErrorHandler("Email or Otp is misssing!", 400))
        try {
            const userAllEntries = await UserModel.find({
                email, accountVerified: false
            }).sort({ createdAt: -1 })
            if (!userAllEntries) return next(new ErrorHandler("User not found!", 404))
            let user
            if (userAllEntries.length > 1) {
                user = userAllEntries[0]
                await UserModel.deleteMany({
                    _id: { $ne: user._id }, email, accountVerified: false
                })
            } else {
                user = userAllEntries[0]
            }
            if (user.verificationCode !== Number(otp)) {
                return next(new ErrorHandler("Invalid OTP!", 400))
            }
            const currentTime = Date.now()
            console.log("currentTime", currentTime)
            const verificationCodeExpireTime = new Date(user.verificationCodeExpire).getTime()
            console.log("verificationCodeExpire", verificationCodeExpireTime)
            if (currentTime > verificationCodeExpireTime) {
                return next(new ErrorHandler("OTP Expired!", 400))
            }
            user.accountVerified = true
            user.verificationCode = null
            user.verificationCodeExpire = null
            await user.save({ validateModifiedOnly: true })// password wont be effected
            sendToken(user, 200, "Account Verified", res)
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error!", 500))
        }

    }
)
