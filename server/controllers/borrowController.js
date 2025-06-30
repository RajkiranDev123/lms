
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { BorrowModel } from "../models/borrowModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// aim : admin will record borrowed book by user!

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params // book id
    const { email } = req.body // email of user that wants to borrow

    try {
        // find the book by id of the book
        const book = await BookModel.findById(id)
        if (!book) return next(new ErrorHandler("Book not found!", 404))

        // find user by email 

        const user = await UserModel.findOne({ email, accountVerified: true })
        if (!user) return next(new ErrorHandler("User not found!", 404))

        // do next when (user and id of book) is present :
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 400))

        // bookId is borrow info
        //
        const isAlreadyBorrowed = user.borrowedBooks.find(
            b => b.bookId.toString() == id && b.returned == false // checked also whether borrowed book is returned!
        )

        if (isAlreadyBorrowed) return next(new ErrorHandler("Book already borrowed!", 400))

        // now (if not borrowed) then first change that (book info) in db ===>

        book.quantity -= 1
        book.availability = book.quantity > 0
        await book.save()
        // book info is saved in db and now go do changes in user too!

        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        })
        await user.save()

        // now finally put borrow info in db!
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
            success: true, message: "recorded borrowed book Successfully!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params // book id
    const { email } = req.body // email of user that wants to borrow


    try {
        // find the book by id of the book
        const book = await BookModel.findById(id)
        if (!book) return next(new ErrorHandler("Book not found!", 404))

        // find user by email 

        const user = await UserModel.findOne({ email, accountVerified: true })
        if (!user) return next(new ErrorHandler("User not found!", 404))

        // do next when (user and id of book) is present :
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 400))

        // bookId is borrow info

        const borrowedBook = user.borrowedBooks.find(
            b => b.bookId.toString() == bookId && b.returned == false // checked also whether borrowed book is returned!
        )

        if (!borrowedBook) return next(new ErrorHandler("Book not borrowed!", 400))
        borrowedBook.returned = true
        await user.save() // now from user side the book is returned!

        book.quantity += 1
        book.availability = book.quantity > 0
        await book.save() //book is also done!

        








        return res.status(201).json({
            success: true,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////

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













