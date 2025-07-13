import ErrorHandler from "../middlewares/errorMiddleware.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { UserModel } from "../models/userModel.js"
import bcrypt from "bcrypt"
import crypto from "crypto"

import { sendVerificationCode } from "../utils/sendVerificationCode.js"
import { sendToken } from "../utils/sendToken.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateForgotpasswordEmailTemplate } from "../utils/emailTemplate.js"

export const register = catchAsyncErrors(

    async (req, res, next) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return next(new ErrorHandler("All fields are required!", 400))
            }

            const isAlreadyRegistered = await UserModel.findOne({ email, accountVerified: true })

            if (isAlreadyRegistered) return next(new ErrorHandler("User Already exists!", 400))

            const registrationAttempts = await UserModel.find({ // [{},{}]
                email, accountVerified: false
            })

            if (registrationAttempts.length >= 5) return next(new ErrorHandler("Exceeded Registration attepmts,Contact Admin!", 400))

            if (password.length < 8 || password.length > 16) {
                return next(new ErrorHandler("Password must be between 8 & 16 characters!", 400))
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await UserModel.create({//instance of schema
                name,
                email,
                password: hashedPassword
            })
            const verificationCode = await user.generateVerificationCode() //get 5 digits random no
            await user.save()
            sendVerificationCode(verificationCode, email, res)
        } catch (error) {
            next(error)
        }

    }, 
    // console.log("register is called!")
)

//////////////////////////////////////////////////// verify otp //////////////////////////////////////////

//send otp to make accountVerified: true

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
                    _id: { $ne: user._id }
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


/////////////////////////////////////////////////// login /////////////////////////////////////////////

export const login = catchAsyncErrors(
    async (req, res, next) => {

        const { email, password } = req.body
        if (!email || !password) {
            return next(new ErrorHandler("All fields are required!", 400))
        }
        try {
            const user = await UserModel.findOne({ email, accountVerified: true }).select("+password")
            if (!user) {
                return next(new ErrorHandler("User does not exists!", 400))
            }
            const isPasswordMatched = await bcrypt.compare(password, user.password)
            if (!isPasswordMatched) {
                return next(new ErrorHandler("Invalid password!", 400))
            }
            sendToken(user, 200, "User loggged-in successfully!", res)
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error!", 500))
        }


    }
)

/////////////////////////////////////////////////// logout /////////////////////////////////////////////

export const logout = catchAsyncErrors(
    async (req, res, next) => {
        try {
            res.status(200)
                .cookie("token", "", {
                    expires: new Date(Date.now()),
                    httpOnly: true
                }).json({ success: true, message: "Logged out successfully!" })

        } catch (error) {
            return next(new ErrorHandler("Internal Server Error!", 500))
        }


    }
)


/////////////////////////////////////////////////// get user /////////////////////////////////////////////

export const getUser = catchAsyncErrors(
    async (req, res, next) => {
        const user = req.user
        try {
            res.status(200).json({ success: true, user })

        } catch (error) {
            console.log("err from getUser ==>",error.message)
            return next(new ErrorHandler("Internal Server Error!", 500))
        }


    }
)


/////////////////////////////////////////////////// forgot Password /////////////////////////////////////////////

//send (reset token & reset url) to email for recovering password

export const forgotPassword = catchAsyncErrors(
    async (req, res, next) => {
        if (!req.body.email) return next(new ErrorHandler("Email is required!", 400))

        const user = await UserModel.findOne({
            email: req.body.email,
            accountVerified: true
        })

        if (!user) {
            return next(new ErrorHandler("Invalid email!", 400))
        }
        const resetToken = user.getResetPasswordToken()
        await user.save({ validateBeforeSave: false })
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
        const message = generateForgotpasswordEmailTemplate(resetPasswordUrl, resetToken)
        try {
            await sendEmail({ email: user.email, subject: "Password recovery for lms!", message })
            return res.status(200).json({ success: true, message: `Email sent to ${user.email} !` })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({ validateBeforeSave: false })
            return next(new ErrorHandler(error.message, 500))
        }
    }
)


///////////////////////////////////////////////////// reset password    /////////////////////////////////////////////////////////

export const resetPassword = catchAsyncErrors(
    async (req, res, next) => {
        try {
            const { token } = req.params
        
            const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
       
            const user = await UserModel.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            })
            console.log(user)
            if (!user) return next(new ErrorHandler("Reset password token is invalid or expired!", 400))
            if (req.body.password !== req.body.confirmPassword) return next(new ErrorHandler("password & confirm password don't match!", 400))

            if (req.body.password.length < 8 ||
                req.body.password.length > 16 ||
                req.body.confirmPassword.length < 8 ||
                req.body.confirmPassword.length > 8
            ) {
                return next(new ErrorHandler("password must be between 8 & 16 characters!", 400))
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user.password = hashedPassword
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            sendToken(user, 200, "Password reset done!", res)
        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

///////////////////////////////////////////////////// update password    /////////////////////////////////////////////////////////

export const updatePassword = catchAsyncErrors(
    async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.user.id).select("+password")
            const { currentPassword, newPassword, confirmNewPassword } = req.body
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return next(new ErrorHandler("All fields are required!", 400))
            }
            const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)
            if (!isPasswordMatched) return next(new ErrorHandler("Current Password is not correct!", 400))


            if (newPassword.length < 8 ||
                newPassword.length > 16 ||
                confirmNewPassword.length < 8 ||
                confirmNewPassword.length > 8
            ) {
                return next(new ErrorHandler("password must be between 8 & 16 characters!", 400))
            }
            if (newPassword !== confirmNewPassword) {
                return next(new ErrorHandler("newPassword & confirmNewPassword do not match!", 400))
            }
            const hashedPassword=await bcrypt.hash(newPassword,10)
            user.password=hashedPassword
            await user.save()
            res.status(200).json({
                success:true,
                message:"password Updated!"
            })

        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
