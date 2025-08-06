
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { BorrowModel } from "../models/borrowModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserModel } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { calculateFine } from "../utils/fineCalculator.js"

// aim : admin will record borrowed book by user!

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req?.params // book id
    const { email } = req?.body // email of user that wants to borrow
    const adminId = req?.user?._id

    try {
        //send reqs at once
        const [book, user] = await Promise.all([
            BookModel.findById(bookId), UserModel.findOne({ email: email.trim() })
        ])

        if (!book) return next(new ErrorHandler("Book not found!", 404))
        if (!user) return next(new ErrorHandler("User not found!", 404))


        // do next when (user and id of book) is present : check quantity of book
        if (book.quantity == 0) return next(new ErrorHandler("Books not available!", 400))

        // check in borrowedBooks:[] of user,if this book is already borrowed
        const isAlreadyBorrowed = user.borrowedBooks.find(
            b => b.bookId.toString() == bookId && b.returned == false // false means this book is not still returned
            // false : then cant give same book more than once to that guy
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
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)//7 days
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
            bookName:book.title,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            price: book.price,//entire book price for 7 days
            recordedBorrowedBookBy: adminId
        })

        return res.status(200).json({
            success: true, message: "Recorded borrowed book Successfully!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//////////////////////////////////////// bring back books to library /////////////////////////////////////////////////////

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params // book id
    const { email } = req.body // email of user that wants to borrow
    const adminId = req?.user?._id

    try {
        //send multiple reqs at once
        const [book, user] = await Promise.all([
            BookModel.findById(bookId), UserModel.findOne({ email: email.trim() })
        ])

        if (!book) return next(new ErrorHandler("Book not found!", 404))
        if (!user) return next(new ErrorHandler("User not found!", 404))

        const borrowedBook = user.borrowedBooks.find(
            b => b.bookId.toString() == bookId && b.returned == false //cant return already returned book
        )

        if (!borrowedBook) return next(new ErrorHandler("Book not borrowed!", 400))

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

        borrow.returnedDate = new Date()//today's date
        borrow.returnedBorrowedBookBy=adminId
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

///////////////////////////////////////////////get borrowedBooks of respective user//////////////////////////////////////////////////

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const page = req.headers.page || 1
    const filter = req.headers.filter || "returned"

    const ITEM_PER_PAGE = 5

    try {
        const { borrowedBooks } = req.user;

        const filteredBooks = borrowedBooks.filter(book => {
            return filter === "returned" ? book.returned === true : book.returned === false;
        });

        const totalDocs = filteredBooks.length;
        const pageCount = Math.ceil(totalDocs / ITEM_PER_PAGE);
        const skip = (page - 1) * ITEM_PER_PAGE;

        const paginatedBooks = filteredBooks?.slice(skip, skip + ITEM_PER_PAGE);

        return res.status(200).json({
            success: true, borrowedBooks: paginatedBooks, message: "All borrowed books of a user!", pageCount
        })
    } catch (error) {
        return next(new ErrorHandler(error?.message || "Internal Server Error", 500))
    }
})


////////////////////////////////////////////// return entire docs from Borrow Collection //////////////////////////////////////////////////////////////

export const getAllBorrowedBooksByUsersForAdmin = catchAsyncErrors(async (req, res, next) => {
    const page = req.headers.page || 1
    const filter = req.headers.filter || "borrowed"

    const ITEM_PER_PAGE = 5
    const now = new Date()
    let query = {};
    if (filter == "borrowed") {
        query = {
            dueDate: { $gt: now }
        };
    }
    if (filter == "overdue") {
        query = {
            dueDate: { $lt: now }
        };
    }

    try {
        const totalDocs = await BorrowModel.countDocuments(query)
        const pageCount = Math.ceil(totalDocs / ITEM_PER_PAGE)//pageCount is total pages 8/4=2 pages
        const skip = (page - 1) * ITEM_PER_PAGE
        const allBorrowedBooks = await BorrowModel.find(query).skip(skip).limit(ITEM_PER_PAGE)
        return res.status(200).json({
            success: true,
            allBorrowedBooks,
            message: "All borrowed books by all users for admin!",
            pageCount
        })
    } catch (error) {
        return next(new ErrorHandler(error?.message || "Internal Server Error", 500))
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////
















