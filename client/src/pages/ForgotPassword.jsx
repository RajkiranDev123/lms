import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const { loading, error, message, user, isAuthenticated } = useSelector(state => state.auth)
  const handleforgotpassword = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice())
    }

  }, [dispatch, isAuthenticated, error, loading])
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }
  return <>
    <div>

      {/* left side */}
      <div>
        <div>
          <div>
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>
          <h3>
            
          </h3>
        </div>
      </div>

      {/* right side */}
      <div>
        iuyf
      </div>

    </div>
  </>;
};

export default ForgotPassword;
