

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"

import { BorrowModel } from "../models/borrowModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"



import ErrorHandler from "../middlewares/errorMiddleware.js"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// admin will assign book

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const { email } = req.body

    try {
        // find book by id of that book
        const book = await BookModel.findById(id)
        if (!book) return next(new ErrorHandler("Book not found!", 404))

        // find user by email 

        const user = await UserModel.findOne({email})
        if (!user) return next(new ErrorHandler("User not found!", 404))

        // do next when user and id of book is present :

        




        return res.status(201).json({
            success: true,
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








