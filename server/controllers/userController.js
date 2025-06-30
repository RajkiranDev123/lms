
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { UserModel } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"

export const getAllUsers = catchAsyncErrors(
    async (req, res, next) => {
        try {
            const users = await UserModel.find({ accountVerified: true })
            res.status(200).json({
                success: true, users, message: "All users fetched!"
            })
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error!", 500))
        }
    }
)

export const registerNewAdmin = catchAsyncErrors(
    async (req, res, next) => {

        try {
            if (!req.files || Object.keys(req.files).length == 0) {
                return next(new ErrorHandler("Admin avatar is reqd!", 400))
            }
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return next(new ErrorHandler("All fields are required!", 400))
            }

            const isRegistred = await UserModel.findOne({ email, accountVerified: true })
            if (isRegistred) return next(new ErrorHandler("Account is already registered!", 400))

            if (password.length < 8 || password.length > 16) return next(new ErrorHandler("Password must be betn 8 & 16 characters!", 400))

            const { avatar } = req.files

            const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
            if (!allowedFormats.includes(avatar.mimetype)) return next(new ErrorHandler("File format not supported!", 400))

            const hashedPassword = await bcrypt.hash(password, 10)

            const cloudinaryResponse = await cloudinary.uploader.upload(
                avatar.tempFilePath, {
                folder: "lms_admin_avatar"
            }
            )

            console.log(99,cloudinaryResponse)

            if (!cloudinaryResponse || cloudinaryResponse.error) return next(new ErrorHandler("Failed to Upload avatar, Clodinary error!", 500))

            const admin = await UserModel.create({
                name, email, password: hashedPassword, role: "Admin", accountVerified: true,
                avatar: {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url
                }
            })

            res.status(201).json({
                success: true, message: "Admin registered Successfully!", admin
            })
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error!", 500))
        }
    }
)