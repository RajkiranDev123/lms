import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { toast } from "react-toastify"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        message: null,
        
        user: null,
        isAuthenticated: false
    },
    reducers: {
        registerRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        registerSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message

        },
        registerFailed(state, action) {
            state.loading = false
            state.error = action.payload

        },

        //////////////////////////////////////////  otp  ///////////////////////////////////////////////////
        otpVerificationRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        otpVerificationSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message
        

        },
        otpVerificationFailed(state, action) {
            state.loading = false
            state.error = action.payload

        },
        //login
        loginRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        loginSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message
            state.isAuthenticated = true
            state.user = action.payload.user

        },
        loginFailed(state, action) {
            state.loading = false
            state.error = action.payload

        },
        //logout
        logoutRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        logoutSuccess(state, action) {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.user = null
        },
        logoutFailed(state, action) {
            state.loading = false
            state.error = action.payload
            state.message = null
        },

        //reset 
        resetAuthSlice(state) {
            state.loading = false
            state.error = null
            state.message = null
            state.isAuthenticated = state.isAuthenticated
            state.user = state.user
        },

        //get user
        getUserRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        getUserSuccess(state, action) {
            state.loading = false

            state.isAuthenticated = true
            state.user = action.payload.user
        },
        getUserFailed(state, action) {
            state.loading = false
            state.user = null
            state.isAuthenticated = false
        },
        //forgotpassword
        forgotPasswordRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false
            state.message = action.payload
        },
        forgotPasswordFailed(state, action) {
            state.loading = false
            state.error = action.payload
        },
        //reset-password
        resetPasswordRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        //automatically login will be true when : resetPasswordSuccess
        resetPasswordSuccess(state, action) {
            state.loading = false
            state.message = action.payload
            // state.user = action.payload.user
            // state.isAuthenticated = true
        },
        resetPasswordFailed(state, action) {
            state.loading = false
            state.error = action.payload
        },

        //update-password
        updatePasswordRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        //automatically login will be true when : resetPasswordSuccess
        updatePasswordSuccess(state, action) {
            state.loading = false
            state.message = action.payload
        },
        updatePasswordFailed(state, action) {
            state.loading = false
            state.error = action.payload
        },
    }
})

export const resetAuthSlice = (data) => async (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice())
}

////////////////////////////////////////// we get dispatch from :  dispatch(register(data))
export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest())
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/register`, data, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.registerSuccess(res?.data))
    }).catch(error => {
        console.log("err from reg==>", error)
        dispatch(authSlice.actions.registerFailed(error?.response?.data?.message))
    })
}

export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.actions.otpVerificationRequest())
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/verify-otp`, { email, otp }, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.otpVerificationSuccess(res?.data))
    }).catch(error => {
        dispatch(authSlice.actions.otpVerificationFailed(error?.response?.data?.message))
    })
}

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest())
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, data, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.loginSuccess(res?.data))
        toast.success("You are Logged-In!")

        localStorage.setItem("authToken", res?.data?.token);
        console.log("token from login ==>", res?.data?.token)

    }).catch(error => {
       

        dispatch(authSlice.actions.loginFailed(error?.response?.data?.message))
    })
}

export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.logoutRequest())
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/logout`, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.logoutSuccess(res?.data?.message))
        dispatch(authSlice.actions.resetAuthSlice())
        toast.success(res?.data?.message)
        localStorage.clear()
    }).catch(error => {
        dispatch(authSlice.actions.logoutFailed(error?.response?.data?.message))
    })
}

export const getUser = () => async (dispatch) => {
    console.log("getUser called!")
    dispatch(authSlice.actions.getUserRequest())
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/me`, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.getUserSuccess(res?.data))

    }).catch(error => {
        dispatch(authSlice.actions.getUserFailed(error?.response?.data?.message))
    })
}

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest())
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/password-forgot`, { email }, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        // console.log(88,res.data.message)
        dispatch(authSlice.actions.forgotPasswordSuccess(res?.data?.message))
    }).catch(error => {
        dispatch(authSlice.actions.forgotPasswordFailed(error?.response?.data?.message))
    })
}

export const resetPassword = (data, token) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest())
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/password-reset/${token}`, data, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.resetPasswordSuccess(res?.data?.message))
    }).catch(error => {
        dispatch(authSlice.actions.resetPasswordFailed(error?.response?.data?.message))
    })
}

export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest())
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/password/update`, data, {
        // withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(authSlice.actions.updatePasswordSuccess(res?.data?.message))
    }).catch(error => {
        dispatch(authSlice.actions.updatePasswordFailed(error?.response?.data?.message))
    })
}
// export const { registerRequest } = authSlice.actions
export default authSlice.reducer




