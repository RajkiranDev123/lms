import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux"
import { formatDateAndTime, formatDate } from "../utils/formatDate.js"
import { toast } from "react-toastify"
import { toggleReturnBookPopup } from "../store/slices/popUpSlice.js"
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice.js"
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice.js"


const Catalog = () => {
  const dispatch = useDispatch()
  const { returnBookPopup } = useSelector(state => state.popup)//state : destructure and actions : import
  const { loading, error, allBorrowedBooks, message } = useSelector(state => state.borrow)

  const [filter, SetFilter] = useState("borrowed")

  const currentDate = new Date()//today date

  // not over due : still in borrowed state not returned!
  const borrowedBooks = allBorrowedBooks?.filter(book => {
    //let say dueDate is : tommorow
    const dueDate = new Date(book.dueDate)
    return dueDate > currentDate//fetch where due date is greater than today : deadline not passed 
  })


  const overdueBooks = allBorrowedBooks?.filter(book => {
    const dueDate = new Date(book.dueDate)
    return dueDate <= currentDate
  })

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks //do setFilter(".....") to change
  const [email, setEmail] = useState("")
  const [borrowedBookId, setBorrowedBookId] = useState("")
  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId)
    setEmail(email)
    dispatch(toggleReturnBookPopup())
  }

  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(fetchAllBooks)
      dispatch(fetchAllBorrowedBooks)
      dispatch(resetBookSlice)
      dispatch(resetBorrowSlice)
    }
    if (error) {
      toast.error(error)
      dispatch(resetBorrowSlice)
    }

  }, [dispatch, error, loading])

  return <>

    <div>

    </div>

  </>;
};

export default Catalog;
