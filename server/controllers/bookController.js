

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"

import ErrorHandler from "../middlewares/errorMiddleware.js"


export const addBook = catchAsyncErrors(async (req, res, next) => {

    try {
        const { title, author, description, price, quantity } = req.body
        if (!title || !author || !description || !price || !quantity) return next(new ErrorHandler("All fields are required", 400))
        const book = await BookModel.create({
            title, author, description, price, quantity
        })
        return res.status(201).json({
            success: true, message: "Book added!", book
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    try {
        const books = await BookModel.find()
        res.status(200).json({
            success: true, message: "All books fetched successfully!", books
        })
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }

})


export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params
        const book = await BookModel.findById(id)
        if (!book) {
            return next(new ErrorHandler("Book not found!", 404))
        }
        await book.deleteOne()
        res.status(200).json({
            success: true,
            message: "Book deleted Successfully!"
        })
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
})



