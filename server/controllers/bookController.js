

// book controller : add book , get all added books , delete book

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
    const title = req.headers.title || ""
    const page = req.headers.page || 1
    const ITEM_PER_PAGE = 5
    try {


        //for pagination
        const query = { title: { $regex: title, $options: "i" } }
        const totalDocs = await BookModel.countDocuments(query)
        const pageCount = Math.ceil(totalDocs / ITEM_PER_PAGE)//pageCount is total pages 8/4=2 pages
        const skip = (page - 1) * ITEM_PER_PAGE

        const books = await BookModel.find(query).skip(skip).limit(ITEM_PER_PAGE)

        res.status(200).json({
            success: true, message: "All books fetched successfully!", books, pagination: { pageCount, totalBooks: totalDocs }
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



