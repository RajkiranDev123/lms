

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"

import { BorrowModel } from "../models/borrowModel.js"

import ErrorHandler from "../middlewares/errorMiddleware.js"


export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {

    try {
      
        return res.status(201).json({
            success: true, 
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {

    try {
      
        return res.status(201).json({
            success: true, 
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {

    try {
      
        return res.status(201).json({
            success: true, 
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {

    try {
      
        return res.status(201).json({
            success: true, 
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})








