import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.svg";
import logo_with_title from "../assets/logo-with-title-black.svg";

import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "../components/loader.css"
const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, message } = useSelector(state => state.auth)
  const handleforgotpassword = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }
  useEffect(() => {

    if (message) {
      toast.success(message)
      dispatch(resetAuthSlice())
      navigate("/password/reset")
    }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }

  }, [error, loading])

  return <>
    <div className="flex flex-col justify-center md:flex-row h-screen">

      {/* left side */}
      <div className="hidden w-full md:w-1/2 bg-gradient-to-r from-indigo-950 to-purple-900 text-white md:flex 
      flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[450px] ">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>
          <h3
            className="text-gray-300 mb-12 max-w-[320px] mx-auto text-sm font-medium leading-10"
          >
            A token for resetting your password will be sent to your email after you provide your email !
          </h3>
        </div>
      </div>

      {/* right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">

        <Link to={"/login"}
          className="border-2 text-white border-white rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-20
           hover:bg-black hover:text-white transition duration-300 text-end">
          Back
        </Link>

        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">
            Forgot Password
          </h1>

          <p className="text-gray-700 text-center mb-12">
            Please enter your email!
          </p>
          <form onSubmit={handleforgotpassword}>
            <div className="mb-4">
              <input type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border-black rounded-md focus:outline-none"

              />
            </div>

            <button disabled={loading ? true : false}
              className="border-2 mt-5 border-black w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              type="submit">
              {loading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="loader"></div></div> : "Send Token"}

            </button>

          </form>
        </div>


      </div>
      {/* right side ends */}

    </div>
  </>;
};

export default ForgotPassword;
