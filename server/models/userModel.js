import mongoose from "mongoose"

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
        default: "User"
    },
    accountVerified: { type: Boolean, default: false },

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
            borrowedDate: Date,
            dueDate: Date
        }
    ],

    avatar: {
        public_id: String,
        url: String

    },

    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,



}, { timestamps: true })

//call this method on instance like : user not on UserModel
userSchema.methods.generateVerificationCode = function () {

    function generate5digits() {
        const firstDigit = Math.floor(Math.random() * 9) + 1 // 1 to 8 and plus 1 = 9
        const remainingDigits = Math.floor(Math.random() * 10000) // 1 to 9,999
            .toString().padStart(4, 0) // 4 is target and what to put is 0
        return parseInt(firstDigit + remainingDigits)
    }
    const verificationCode = generate5digits()
    this.verificationCode = verificationCode//save to db too!
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000
    return verificationCode

}

export const UserModel = mongoose.model("User", userSchema)