import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"         //role="User" : automatically saved to db because of (default :) even role is not supplied!
    },

    accountVerified: { type: Boolean, default: false },
    avatar: { public_id: String, url: String },

    borrowedBooks: [
        {

            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Borrow"
            },
            returned: {
                type: Boolean,
                default: false,
            },

            bookTitle: String,

            borrowedDate: Date, // when booked
            dueDate: Date //when to return
        }
    ],

    verificationCode: Number,
    verificationCodeExpire: Date,

    resetPasswordToken: String, // not in db after just creating new acc because of absence of ==> (required or default)
    resetPasswordExpire: Date,

}, { timestamps: true })

//call this method on instance like : user not on UserModel
userSchema.methods.generateVerificationCode = function () {

    function generate5digits() {
        const firstDigit = Math.floor(Math.random() * 9) + 1 // 1 to 8 and plus 1 = 9 : single digit
        const remainingDigits = Math.floor(Math.random() * 10000) // 1 to 9,999 : 4 digits : can give even 1 digit sometimes
            .toString().padStart(4, 0) // 4 is target and what to put is 0 : if 8 then 0008
        return parseInt(firstDigit + remainingDigits)
    }
    const verificationCode = generate5digits()
    this.verificationCode = verificationCode//save to db too!
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000 // 15 mins
    return verificationCode

}

// generate access token
userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}

// getResetPasswordToken
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}


export const UserModel = mongoose.model("User", userSchema)