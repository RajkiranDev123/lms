import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.svg";
import logo_with_title from "../assets/logo-with-title-black.svg";

import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify"
import "../components/loader.css"

const OTP = () => {
  const { email } = useParams()
  const [otp, setOtp] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, message } = useSelector(state => state.auth)//from store

  const handleOtpVerification = (e) => {
    e.preventDefault()
    if (!email || !otp) {
      toast.error("OTP is required!")
      return
    }
    if (otp?.length < 5) {
      toast.error("OTP must be 5 digits!")
      return
    }
    dispatch(otpVerification(email, otp))
  }
  useEffect(() => {
    if (message) {
      toast.success(message)
      navigate("/login")
    }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }
  }, [error, loading])


  return <>
    {/* top div */}
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* left side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        <Link to={"/register"}
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-20
           hover:bg-black hover:text-white transition duration-300 text-end">
          Back
        </Link>
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-12">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>

          </div>
          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Check your Mailbox</h1>
          <p className="text-gray-800 mb-12 text-center">Please enter the OTP to proceed</p>

          <form onSubmit={handleOtpVerification}>

            <div className="mb-4">
              <input className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                type="number" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />
            </div>

            <button
              className="border-2 mt-5 border-black w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              type="submit">
              {loading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="loader"></div></div> : "Verify"}
            </button>

          </form>

        </div>

      </div>

      {/* right side */}
      <div
        className="hidden w-full md:1/2 bg-gradient-to-r from-indigo-950 to-purple-900 text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px] ">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44" />
          </div>
          <p className="text-gray-300 mb-12">New to our platform ? Sign up now.</p>
          <Link
            className="border-2 mt-5 border-black px-8 w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
            to={"/register"}>Sign Up</Link>
        </div>



      </div>

    </div>

  </>;
};

export default OTP;
