import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import Header from "../layout/Header"

import logo_with_title from "../assets/logo-with-title-black.svg";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Link } from "react-router-dom"

import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement
} from "chart.js";
import logo from "../assets/black-logo.svg";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const UserDashboard = () => {
  const { settingPopup } = useSelector(state => state.popup)
  const { booksCount } = useSelector(state => state.book)

  const { userBorrowedBooks } = useSelector(state => state.borrow)
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0)
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0)

  useEffect(() => {

    let numberOfTotalBorrowedBooks = userBorrowedBooks?.filter(book => book.returned === false)
    let numberOfTotalReturnedBooks = userBorrowedBooks?.filter(book => book.returned === true)
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length)
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length)


  }, [userBorrowedBooks])

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["red", "green"],
        hoverOffset: 4
      }
    ]
  }

  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      <div className="flex flex-col-reverse xl:flex-row">
        {/* left side */}
        <div className="flex flex-[4] flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh] ">
          <div className="flex flex-col gap-7 flex-[4]">

            <div className="flex flex-col lg:flow-row gap-1 overflow-y-hidden">

              <div className="flex items-center gap-3 bg-white p-1 min-h-[60px] overflow-y-hidden rounded-lg 
              transition hover:shadow-inner duration-300">
                <span className="w-[2px] bg-black h-5 lg:h-full"></span>
                <span className="bg-gray-300 h-8 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  <img src={bookIcon} alt="book" className="w-5 h-5" />
                </span>
                <p>Your Borrowed Books : <span className="font-semibold">{totalBorrowedBooks}</span> </p>
              </div>

              {/*  */}
              <div className="flex items-center gap-3 bg-white p-1 min-h-[60px] overflow-y-hidden rounded-lg 
              transition hover:shadow-inner duration-300">
                <span className="w-[2px] bg-black h-5 lg:h-full"></span>
                <span className="bg-gray-300 h-8 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  <img src={returnIcon} alt="book" className="w-5 h-5" />
                </span>
                <p>Your Returned Books : <span className="font-semibold">{totalReturnedBooks}</span>  </p>
              </div>

            </div>

            <div className="flex flex-col lg:flex-row gap-7">

              <div className="flex items-center gap-3 bg-white p-3 max-h-[60px] overflow-y-hidden rounded-lg 
              transition hover:shadow-inner duration-300">
                <span className="w-[2px] bg-black h-20 lg:h-full"></span>
                <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  {/* <img src={browseIcon} alt="book" className="w-8 h-8" /> */}⌸
                </span>
                <p> Total books in our inventory : <span className="font-semibold">{booksCount}</span> </p>
              </div>
              <img style={{ height: "100px" }} src={logo_with_title} alt="logo" className="hidden lg:block width-auto justify-end" />
            </div>

          </div>

          <div className="bg-white p-1 text-sm sm:text-xl xl:text-xl 2xl:text-2xl min-h-10 font-semibold relative flex-[3] flex justify-center
           items-center rounded-2xl">
            <h4 className="overflow-y-hidden">"Welcome to LMS!"</h4>
            {/* <p className="text-gray-700 text-sm sm:text-lg absolute right-[35px] sm:right-[78px] bottom-[10px]  ">~ Raj Team</p> */}

          </div>
        </div>

        {/* left side */}


        {/* right side */}
        <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-3">

          <div className="xl:flex-[4] flex items-end w-full content-center">
            <Pie
              data={data}
              options={{ cutout: 0 }}
              className="mx-auto lg:mx-0 w-full h-auto"
            />
          </div>

          <div className="flex items-center p-1 w-full sm:w-[400px] xl:w-fit mr-55 xl:p-3 2xl:p-6 gap-5 h-fit
           xl:min-h-[150px] bg-white xl:flex-1 rounded-lg">
            <img src={logo} alt="logo " className="w-auto h-10 2xl:h-10" />
            <span className="w-[2px] bg-black h-full"></span>

            <div className="flex flex-col gap-5">
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[red]"></span>
                <span>Total Borrowed Books</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[green]"></span>
                <span>Total Returned Books</span>
              </p>
            </div>

          </div>

        </div>


        {/* right side */}


      </div>

    </main>

  </>;
};

export default UserDashboard;
