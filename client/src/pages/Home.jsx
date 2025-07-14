import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import SideBar from "../layout/SideBar"

//6 
import UserDashboard from "../components/UserDashboard"
import AdminDashboard from "../components/AdminDashboard"
import BookManagement from "../components/BookManagement"

import Catalog from "../components/Catalog"
import MyBorrowedBooks from "../components/MyBorrowedBooks"
import Users from "../components/Users"
//



const Home = () => {

  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState("")
  const { user, isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    console.log("home is called!")

    return <Navigate to={"/login"} />
  }

  return <>
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">

      {/* GiHamburgerMenu */}
      {/* md:hidden : hide after crossing or reaching md  */}
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 
      flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu className="text-2xl" onClick={() => setIsSideBarOpen(!isSideBarOpen)} />
      </div>

      {/* SideBar & will always open : no restriction with role */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />


      {/* iife : display components here */}

      {
        (
          () => {
            switch (selectedComponent) {
              case "Dashboard":
                return user?.role == "User" ? (<UserDashboard />) : (<AdminDashboard />)

              case "Books":
                return <BookManagement />

              case "Catalog":
                if (user?.role == "Admin") return <Catalog />

              case "Users":
                if (user?.role == "Admin") return <Users />

              case "My Borrowed Books":
                if (user?.role == "Admin") return <MyBorrowedBooks />

              default:
                return user?.role == "User" ? (<UserDashboard />) : (<AdminDashboard />)
            }
          }
        )()
      }
      {/* iife  ends*/}



    </div>

  </>;
};

export default Home;
