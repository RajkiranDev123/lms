import mongoose from "mongoose"

//record borrow info

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

    price: { // price to borrow the book
        type: Number,
        required: true,

    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowDate: {
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
    }


}, { timestamps: true })

export const BorrowModel = mongoose.model("Borrow", borrowSchema)