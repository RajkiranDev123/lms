import React, { useState, useEffect, useRef } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"
import { toggleReadBookPopup, toggleRecordBookPopup, toggleAddBookPopup } from "../store/slices/popUpSlice"
import { toast } from "react-toastify"
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice"
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice"
import Header from "../layout/Header"

import AddBookPopup from "../popups/AddBookPopup"
import ReadBookPopup from "../popups/ReadBookPopup"
import RecordBookPopup from "../popups/RecordBookPopup"

//pagination

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const BookManagement = () => {
  //pagination place 0
  const didMount = useRef(false);
  //
  const dispatch = useDispatch()
  const { loading, error, message, books, pageCount } = useSelector(state => state.book)
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(state => state.popup)
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(state => state.borrow)

  const [readBook, setReadBook] = useState({})
  const openReadPopup = (id) => {
    console.log(id, books)
    const book = books.find(book => book._id === id)
    setReadBook(book)
    dispatch(toggleReadBookPopup())
  }

  const [borrowBookId, setBorrowBookId] = useState("")
  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId)
    dispatch(toggleRecordBookPopup())
  }

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage)
      dispatch(fetchAllBooks())
      dispatch(fetchAllBorrowedBooks())
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice())
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError)
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice())
    }

  }, [dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage])

  //pagination place 1
  const [page, setPage] = useState(1)
  const [title, setTitle] = useState("")
  const handleSearch = () => {
    dispatch(fetchAllBooks(title?.toLowerCase(), 1))
  }
  //


  //pagination place 2
  const changePage = (event, value) => {
    dispatch(fetchAllBooks("", value))

    setPage(value)

  }
  //debouncing 
  useEffect(() => {
    let timer1
    if (didMount.current) {
      timer1 = setTimeout(() => {
        handleSearch()
      }, 2000)

    } else { didMount.current = true }
    return () => clearTimeout(timer1)
  }, [title])

  return <>
    <main className="relative flex flex-col flex-1 p-6 pt-28">
      <Header />
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          {isAuthenticated && user?.role === "Admin" ? "Book Management" : "Books"}
        </h2>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {isAuthenticated && user?.role === "Admin" && (

            <button onClick={() => dispatch(toggleAddBookPopup())}
              className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4
             bg-black text-white rounded-md hover:bg-gray-800"
            >
              <span className="bg-white flex justify-center items-center overflow-hidden rounded-full
               text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                +
              </span>

              Add Book
            </button>

          )}
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full sm:w-52 border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={() => { dispatch(fetchAllBooks("", 1)); setTitle(""); setPage(1) }}
            className="bg-green-900 text-white rounded-md p-2 hover:bg-green-500">Clear</button>
        </div>

      </header>

      {/* table */}
      {
        books && books?.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-left">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-center">Record Book</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {
                  books?.map((book, index) => (
                    <tr key={book?._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2 ">{index + 1 + (page - 1) * 5}</td>
                      <td className="px-4 py-2 ">{book?.title}</td>
                      <td className="px-4 py-2 ">{book?.author}</td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 ">{book?.quantity}</td>
                      )}
                      <td className="px-4 py-2 ">{book?.price}</td>
                      <td className="px-4 py-2 ">{book?.availability ? "Available" : "Not Available"}</td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                          <BookA onClick={() => openReadPopup(book?._id)} />
                          <NotebookPen onClick={() => openRecordBookPopup(book?._id)} />

                        </td>
                      )}
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="flex justify-center p-3">
              <Stack spacing={2}>
                <Pagination color="primary" onChange={changePage} page={page} count={pageCount} />
              </Stack>
            </div>


          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No books found in library!
          </h3>
        )
      }

      {/* table */}


    </main>

    {addBookPopup && <AddBookPopup />}
    {readBookPopup && <ReadBookPopup book={readBook} />}
    {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}



  </>;
};

export default BookManagement;
