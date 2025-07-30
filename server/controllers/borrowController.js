
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { BorrowModel } from "../models/borrowModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { calculateFine } from "../utils/fineCalculator.js"

// aim : admin will record borrowed book by user!

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params // book id
    const { email } = req.body // email of user that wants to borrow

    try {
        //send reqs at once
        const [book, user] = await Promise.all([
            BookModel.findById(bookId), UserModel.findOne({ email: email.trim() })
        ])

        if (!book) return next(new ErrorHandler("Book not found!", 404))
        if (!user) return next(new ErrorHandler("User not found!", 404))


        // do next when (user and id of book) is present : check quantity of book
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 400))

        // check in borrowedBooks:[] of user
        const isAlreadyBorrowed = user.borrowedBooks.find(
            b => b.bookId.toString() == bookId && b.returned == false // checked also whether borrowed book is returned!
            // false : then cant give same book more than once to a guy
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
            success: true, message: "Recorded borrowed book Successfully!"
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
        //send multiple reqs at once
        const [book, user] = await Promise.all([
            BookModel.findById(bookId), UserModel.findOne({ email: email.trim() })
        ])

        if (!book) return next(new ErrorHandler("Book not found!", 404))
        if (!user) return next(new ErrorHandler("User not found!", 404))

        // do next when (user and id of book) is present :
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 404))

        //
        const borrowedBook = user.borrowedBooks.find(
            b => b.bookId.toString() == bookId && b.returned == false // checked also whether borrowed book is returned!
        )
        // !null is true
        if (!borrowedBook) return next(new ErrorHandler("Book not borrowed!", 400))//cant return when book is not borrowed!

        borrowedBook.returned = true
        await user.save() // now from user side the book is returned!

        // also need to do changes in book!
        book.quantity += 1
        book.availability = book.quantity > 0
        await book.save() //book is also done!

        // now lastly update borrow model

        const borrow = await BorrowModel.findOne({
            book: bookId, "user.email": email, returnedDate: null
        })

        if (!borrow) return next(new ErrorHandler("Book not borrowed!", 400))

        borrow.returnedDate = new Date()
        const fine = calculateFine(borrow.dueDate)
        borrow.fine = fine
        await borrow.save()

        return res.status(200).json({
            success: true,
            message:
                fine == 0 ? `The book has been returned!, Total charges is Rs.${book.price}`
                    :
                    `The book has been returned!, Total charges is ${book.price + fine}+`
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

///////////////////////////////////////////////get borrowedBooks of user//////////////////////////////////////////////////

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {

    try {
        const { borrowedBooks } = req.user
        return res.status(200).json({
            success: true, borrowedBooks, message: "all borrowed books of a user!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {

    try {
        const allBorrowedBooks = await BorrowModel.find()
        return res.status(200).json({
            success: true,
            allBorrowedBooks,
            message: "All borrowed books by all users!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////
















