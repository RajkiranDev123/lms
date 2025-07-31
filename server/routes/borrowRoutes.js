import express from "express"
import { recordBorrowedBook, getAllBorrowedBooksByUsersForAdmin, borrowedBooks, returnBorrowedBook } from "../controllers/borrowController.js"
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"
const router = express.Router()

router.post("/record-borrow-book/:bookId", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook)


router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowedBook)


router.get("/my-borrowed-books", isAuthenticated, borrowedBooks)


router.get("/all-borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getAllBorrowedBooksByUsersForAdmin)



















export default router