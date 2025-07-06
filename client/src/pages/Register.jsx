import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { register, resetAuthSlice } from "../store/slices/authSlice"
import { toast } from "react-toastify"
const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const { loading, error, message, user, isAuthenticated } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const handleRegister = (e) => {

    e.preventDefault()
    const data = new FormData()
    data.append("name", name)
    data.append("password", password)
    data.append("email", email)
    dispatch(register(data))


  }

  useEffect(() => {
    if (message) {
      navigate(`/otp-verification/${email}`)
    }
    if (error) {
      toast.error(error)
      dispatch(resetAuthSlice)
    }

  }, [message, dispatch, isAuthenticated, error, loading])

  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }




  return <>

    <div>
{/* left side */}
      <div>

      </div>

      <div>

      </div>

    </div>


  </>;
};

export default Register;
