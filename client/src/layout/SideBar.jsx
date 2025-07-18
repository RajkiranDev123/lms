import { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title-black.svg";

import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";

import AddNewAdmin from "../popups/AddNewAdmin"
import SettingPopup from "../popups/SettingPopup"


import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);

  const { loading, error, message, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>

      <aside className={`${isSideBarOpen ? "left-0" : "-left-full"} 
        z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gradient-to-r from-indigo-950 to-purple-900 text-white flex-col h-full`}
        style={{ position: "fixed" }}
      >

        {/* logo */}
        <div className="flex flex-col justify-center px-6 my-8 py-4">
          <img style={{ height: "100px" }} src={logo_with_title} alt="logo" />
          <p className="text-center font-mono">Welcome to LMS</p>
        </div>
        {/* logo ends */}


        {/* nav starts */}
        <nav className="flex-1 px-6 space-y-2">

          {/* dashboard */}
          <button
            onClick={() => setSelectedComponent("Dashboard")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={dashboardIcon} alt="dashboard" />
            <span>Dashboard</span>
          </button>

          {/* books */}
          <button
            onClick={() => setSelectedComponent("Books")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={bookIcon} alt="books" />
            <span>Books</span>
          </button>



          {isAuthenticated && user?.role === "Admin" && (
            <>
              {/* catalog */}
              <button
                onClick={() => setSelectedComponent("Catalog")}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={catalogIcon} alt="catalog" /> <span>Catalog</span>
              </button>

              {/* users */}
              <button
                onClick={() => setSelectedComponent("Users")}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={usersIcon} alt="users" /> <span>Users</span>
              </button>

              {/*  add new admin */}
              <button
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <RiAdminFill className="w-6 h-6" /> <span>Add New Admin</span>
              </button>

            </>
          )}

          {/*                                role when user                                            */}

          {/* my borrowed books */}
          {isAuthenticated && user?.role === "User" && (
            <button
              onClick={() => setSelectedComponent("My Borrowed Books")}
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            >
              <img src={catalogIcon} alt="my-borrowed-books" />{" "}
              <span>My Borrowed Books</span>
            </button>
          )}

          {/*                                role when user ended                                        */}

          {/* Update Credentials only in mobile version */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={settingIcon} alt="setting" />{" "}
            <span>Update Credentials</span>
          </button>


        </nav>
        {/* nav ends */}



        {/* logout */}
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex
             items-center justify-center space-x-5 mb-7 mx-auto w-fit"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" /> <span>Log Out</span>
          </button>
        </div>
        {/* logout */}


        {/* close top right */}
        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
        {/*  */}


      </aside>

      {/* modals */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}


    </>
  );
};

export default SideBar;
