import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.svg";
import logo_with_title from "../assets/logo-with-title-black.svg";

import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { register, resetAuthSlice } from "../store/slices/authSlice"
import { toast } from "react-toastify"
import "../components/loader.css"
const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const { loading, error, message, user, isAuthenticated } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("All fields are required!")
      return
    }

    const data = new FormData()
    data.append("name", name)
    data.append("password", password)
    data.append("email", email)
    dispatch(register(data))


  }

  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(resetAuthSlice())

      navigate(`/otp-verification/${email}`)
    }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }

  }, [message, dispatch, isAuthenticated, error, loading])

  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }




  return <>

    <div className="flex flex-col  md:flex-row h-screen">
      {/* left side */}
      <div className="hidden w-full md:w-1/2 bg-gradient-to-r from-indigo-950 to-purple-900 text-white md:flex flex-col 
      items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] ">
        <div className="text-center h-[376px]">
          <div className="flex flex-col justify-center">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            <p className="text-center font-mono">Welcome to LMS</p>

          </div>
          <p className="text-gray-300 mb-12">Already have an Account? Sign in now!</p>
          <Link className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
            to={"/login"}>Sign In</Link>
        </div>
      </div>

      {/* right side */}

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">

          <div className="flex justify-center mb-12">

            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">

              <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
              <img src={logo} alt="logo" className="h-auto w-24 object-cover" />

            </div>



          </div>

          <p className="text-center text-gray-800 mb-12">Please Provide Your Info to Sign Up!</p>
          <form onSubmit={handleRegister}>

            <div className="mb-2">
              <input type="text" placeholder="Full Name"
                value={name}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="mb-2">
              <input type="text" placeholder="Email"
                value={email}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="mb-2">
              <input type="text" placeholder="Password"
                value={password}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="block md:hidden font-semibold mt-5">
              <p>Already have Account?</p>
              <Link className="text-sm text-gray-500 hover:underline" to={"/login"}>Sign In</Link>
            </div>

            <button
              className="border-2 mt-5 border-black w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              type="submit">

              {loading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="loader"></div></div> : "Sign Up "}


            </button>

          </form>

        </div>
      </div>

    </div>


  </>;
};

export default Register;
