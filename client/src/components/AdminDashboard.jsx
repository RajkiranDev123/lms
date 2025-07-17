import React, { useState, useEffect } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import Header from "../layout/Header";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement
);

const AdminDashboard = () => {

  const { user } = useSelector(state => state.auth)
  const { users } = useSelector(state => state.user)
  const { books } = useSelector(state => state.book)
  const { allBorrowedBooks } = useSelector(state => state.borrow)
  const { settingPopup } = useSelector(state => state.popup)

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAdmins, setTotalAdmins] = useState(0)
  const [totalBooks, setTotalBooks] = useState((books && books?.length) || 0)
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0)
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0)

  useEffect(() => {
    let numberOfUsers = users?.filter(user => user?.role === "User")
    let numberOfAdmins = users?.filter(user => user?.role === "Admin")
    setTotalUsers(numberOfUsers)
    setTotalAdmins(numberOfAdmins)

    let numberOfTotalBorrowedBooks = allBorrowedBooks?.filter(book => book?.returnedDate === null)
    let numberOfTotalReturnedBooks = allBorrowedBooks?.filter(book => book?.returnedDate !== null)
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks?.length)
    setTotalReturnedBooks(numberOfTotalReturnedBooks?.length)

  }, [users, allBorrowedBooks])

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4
      }
    ]
  }
  return <>

    <main className="relative flex-1 p-6 pt-28">
      <Header />

      <div className="flex flex-col-reverse xl:flex-row">

        {/* ls */}
        <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center 
        xl:flex-col justify-between xl:gap-20 py-5">
          <div className="xl:flex-[4] flex items-end w-full content-center">
            <Pie
              data={data}
              options={{ cutout: 0 }}
              className="mx-auto lg:mx-0 w-full h-auto"
            />
          </div>
          <div className="flex items-center p-8 w-full sm:w-[480px] xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-[150px] bg-white xl:flex-1 rounded-lg">
            <img src={logo} alt="logo" className="w-auto xl:flex-1 rounded-lg" />
            <span className="w-[2px] bg-black h-full"></span>

            <div className="flex items-center gap-3">
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
                <span>Total Borrowed Books</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
                <span>Total Returned Books</span>
              </p>
            </div>
          </div>

        </div>

        {/* ls */}


        {/* rs */}
        <div></div>

        {/* rs */}





      </div>

    </main>






  </>;
};

export default AdminDashboard;
