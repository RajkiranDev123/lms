import express from "express"
import { recordBorrowedBook, getBorrowedBooksForAdmin, borrowedBooks, returnBorrowedBook } from "../controllers/borrowController.js"
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"
const router = express.Router()

router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook)


router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowedBook)


router.get("/my-borrowed-books", isAuthenticated, borrowedBooks)


router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin)



















export default router