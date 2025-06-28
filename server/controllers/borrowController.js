

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"

import { BorrowModel } from "../models/borrowModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"



import ErrorHandler from "../middlewares/errorMiddleware.js"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// aim : admin will record borrowed book by user!

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const { email } = req.body

    try {
        // find the book by id of the book
        const book = await BookModel.findById(id)
        if (!book) return next(new ErrorHandler("Book not found!", 404))

        // find user by email 

        const user = await UserModel.findOne({ email })
        if (!user) return next(new ErrorHandler("User not found!", 404))

        // do next when (user and id of book) is present :
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 400))

        const isAlreadyBorrowed = user.borrowedBooks.find(
            b => b.bookId.toString() == id && b.returned == false
        )

        if (isAlreadyBorrowed) return next(new ErrorHandler("Book already borrowed!", 400))

        book.quantity -= 1
        book.availability = book.quantity > 0

        await book.save()

        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        })
        await user.save()
        await BorrowModel.create({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            book: book._id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            price: book.price
        })

        return res.status(200).json({
            success: true, message: "Borrowed book recored Successfully!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////

export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {

    try {

        return res.status(201).json({
            success: true,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////


export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {

    try {

        return res.status(201).json({
            success: true,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////


export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {

    try {

        return res.status(201).json({
            success: true,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})








