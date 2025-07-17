import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux"
import { formatDateAndTime, formatDate } from "../utils/formatDate.js"
import { toast } from "react-toastify"
import { toggleReturnBookPopup } from "../store/slices/popUpSlice.js"
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice.js"
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice.js"
import ReturnBookPopup from "../popups/ReturnBookPopup.jsx"
import Header from "../layout/Header.jsx"


const Catalog = () => {
  const dispatch = useDispatch()
  const { returnBookPopup } = useSelector(state => state.popup)//state : destructure and actions : import
  const { loading, error, allBorrowedBooks, message } = useSelector(state => state.borrow)
  console.log("allBorrowedBooksByUsers ==>", allBorrowedBooks)

  const [filter, setFilter] = useState("borrowed")

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
      dispatch(fetchAllBooks())
      dispatch(fetchAllBorrowedBooks())
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice())
    }
    if (error) {
      toast.error(error)
      dispatch(resetBorrowSlice())
    }

  }, [dispatch, error, loading])

  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />


      {/* header 2 */}

      <header className="flex flex-col gap-3 sm:flex-row md:items-center">
        <button onClick={() => setFilter("borrowed")}
          className={`relative rounded sm:rounded-br-none sm:rounded-tr-none sm:rounded-tl-lg 
          sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter === "borrowed" ?
              "bg-black text-white border-black"
              : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            } `}>

          Borrowed Books

        </button>

        <button onClick={() => setFilter("overdue")}
          className={`relative rounded sm:rounded-bl-none sm:rounded-tl-none sm:rounded-tr-lg 
          sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter === "overdue" ?
              "bg-black text-white border-black"
              : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            } `}>

          Overdue Books/Borrowers

        </button>

      </header>
      {/* header 2 */}


      {/* data */}

      {
        booksToDisplay && booksToDisplay?.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">

            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Date & Time</th>
                  <th className="px-4 py-2 text-left">Return now</th>


                  <th className="px-4 py-2 text-left"></th>

                </tr>
              </thead>

              <tbody>
                {
                  booksToDisplay?.map((book, index) => (
                    <tr key={index} className={(index + 1) % 2 == 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{book?.user?.name}</td>
                      <td className="px-4 py-2">{book?.user?.email}</td>
                      <td className="px-4 py-2">{book?.price}</td>
                      <td className="px-4 py-2">{formatDate(book?.dueDate)}</td>
                      <td className="px-4 py-2">{formatDateAndTime(book?.createdAt)}</td>

                      <td className="px-4 py-2">
                        {
                          book?.returnedDate ? (
                            <FaSquareCheck className="w-6 h-6" />
                          ) : (
                            <PiKeyReturnBold className="w-6 h-6"
                              onClick={() => openReturnBookPopup(book?.book, book?.user?.email)} />
                          )
                        }

                      </td>
                    </tr>
                  ))
                }
              </tbody>

            </table>

          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">No {filter === "borrowed" ? "borrowed" : "overdue"} books found!</h3>
        )}

      {/* data */}
    </main>

    {returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email} />}

  </>;
};

export default Catalog;
