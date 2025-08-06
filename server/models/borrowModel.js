import mongoose from "mongoose"

//record borrow info at the time of borrowing :

const borrowSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },

    price: { // price to borrow the book , let say like rent for some days
        type: Number,
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    bookName: {
        type: String,
    },
    borrowDate: { //borrowedDate would be nice
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedDate: { // when the book was returned!
        type: Date,
        default: null
    },
    fine: {
        type: Number,
        default: 0
    },
    notified: {
        type: Boolean,
        default: false
    },
    recordedBorrowedBookBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    returnedBorrowedBookBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
}, { timestamps: true })

export const BorrowModel = mongoose.model("Borrow", borrowSchema)