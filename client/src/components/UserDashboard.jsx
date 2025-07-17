import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"

import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";

import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const UserDashboard = () => {
  const { settingPopup } = useSelector(state => state.popup)
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
    labels: [],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: []
      }
    ]
  }

  return <>



  </>;
};

export default UserDashboard;
