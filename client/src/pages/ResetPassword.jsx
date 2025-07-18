import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/black-logo.svg";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux"
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice"
import { toast } from "react-toastify"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, message, error } = useSelector(state => state.auth)

  const handleResetPassword = (e) => {
    e.preventDefault()

    if (!token) {
      toast.error("Token is missing!")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should match!")
      return
    }
    const formData = new FormData()
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)
    dispatch(resetPassword(formData, token?.trim()))
  }
  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(resetAuthSlice())

      navigate(`/login`)
    }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }

  }, [error, loading])



  return <>
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* left */}
      <div className="hidden w-full md:w-1/2 bg-gradient-to-r from-indigo-950 to-purple-900 text-white md:flex 
      flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[450px] ">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>
          <h3
            className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10"
          >
            Finally now you can reset your password here!
          </h3>
        </div>

      </div>

      {/* right */}

      {/* right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">

        <Link to={"/password/forgot"}
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-20
           hover:bg-black text-white hover:text-white transition duration-300 text-end">
          Back
        </Link>

        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">
            Reset Password
          </h1>

          <p className="text-gray-700 text-center mb-12">
            Please enter your new Password!
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input type="password"

                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here..."
                className="w-full px-4 py-3 border-black rounded-md focus:outline-none"

              />
            </div>
            <div className="mb-4">
              <input type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border-black rounded-md focus:outline-none"

              />
            </div>

            <div className="mb-4">
              <input type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border-black rounded-md focus:outline-none"

              />
            </div>

            <button
              className="border-2 mt-5 border-black w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              type="submit">
              {loading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="loader"></div></div> : "Reset"}

            </button>

          </form>
        </div>


      </div>
      {/* right side ends */}



    </div>

  </>;
};

export default ResetPassword;
