import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/black-logo.svg";
import logo_with_title from "../assets/logo-with-title-black.svg";

import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import "../components/loader.css"
import eyeOpen from "../assets/eye_open.png"
import eyeClose from "../assets/eye_close.png"
import { CopyToClipboard } from 'react-copy-to-clipboard';
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [togglePassword, setTogglePassword] = useState(false)

  const inputRef = useRef(null)

  const dispatch = useDispatch()//useDispatch  returns a reference of dispatch function from the redux store
  //dispatch acts as a messenger, delivering instructions (actions) to the state manager (reducer) to update 
  //state. This is the only way to do state change
  const { loading, error, message, user, isAuthenticated } = useSelector(state => state.auth)
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("All fields are required!")
      return
    }
    if (password?.length < 8) {
      toast.error("Password must be greater than or equal to 8 Characters!")
      return
    }

    const data = new FormData()
    data.append("email", email)
    data.append("password", password)
    dispatch(login(data))

  }
  useEffect(() => {

    inputRef?.current?.focus()
    // if (message) {
    //   toast.success(message)
    //   dispatch(resetAuthSlice())
    // }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }

  }, [message, dispatch, isAuthenticated, error, loading])

  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }
  return <>
    {/* top div */}
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* left side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">

        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-12">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>

          </div>
          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Welcome Back!</h1>
          <p className="text-gray-800 mb-12 text-center">Please enter your credentials to login!</p>

          <form onSubmit={handleLogin}>
            {/*  */}
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>Admin Test Email :
              <CopyToClipboard text="rajkir783@gmail.com">
                <span style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "underline" }}> Copy!</span>
              </CopyToClipboard>
            </p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>Admin Test Password :
              <CopyToClipboard text="12345678">
                <span style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "underline" }}> Copy!</span>
              </CopyToClipboard>
            </p>
            {/*  */}
            <hr />

            {/*  */}
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>User Test Email :
              <CopyToClipboard text="rk7889666@gmail.com">
                <span style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "underline" }}> Copy!</span>
              </CopyToClipboard>
            </p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>User Test Password :
              <CopyToClipboard text="12345678">
                <span style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "underline" }}> Copy!</span>
              </CopyToClipboard>
            </p>
            <br />
            {/*  */}

            <div className="mb-4">
              <input ref={inputRef} className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>

            <div className="mb-4 relative">
              <input className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                type={togglePassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

              <div className="absolute right-2 top-4">
                {togglePassword ? <img onClick={() => setTogglePassword(false)} style={{ cursor: "pointer" }} width={19} height={15} src={eyeOpen} alt="eye" />
                  : <img onClick={() => setTogglePassword(true)} style={{ cursor: "pointer" }} width={19} height={15} src={eyeClose} alt="eye" />}

              </div>



            </div>

            <Link to={"/password/forgot"} className="font-semibold rounded-md text-black mb-12 ">Forgot Password ? </Link>

            <div className="block md:hidden font-semibold mt-5">
              <p>New to our platform ? <Link className="text-sm text-gray-500 hover:underline" to={"/register"}>Sign Up</Link></p>
            </div>

            <button
              className="border-2 mt-5 border-black w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              type="submit">

              {loading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="loader"></div></div> : "Login"}

            </button>

          </form>

        </div>

      </div>

      {/* right side */}
      <div
        className="hidden w-full md:1/2 bg-gradient-to-r from-indigo-950 to-purple-900 text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px] ">
        <div className="text-center h-[400px]">
          <div className="mb-12 flex flex-col justify-center">
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44" />
            <p className="text-center font-mono">Welcome to LMS</p>

          </div>
          <p className="text-gray-300 mb-12">New to our platform ? Sign Up now!</p>
          <Link
            className="border-2 mt-5 border-black px-8 w-full font-semibold bg-black
              text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
            to={"/register"}>Sign Up</Link>
        </div>



      </div>

    </div>


  </>;
};

export default Login;
