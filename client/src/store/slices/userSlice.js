import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-toastify"
import { toggleAddNewAdminPopup } from "./popUpSlice"

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false
    },
    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true
        },
        fetchAllUsersSuccess(state, action) {
            state.loading = false,
                state.users = action.payload
        },
        fetchAllUsersFailed(state) {
            state.loading = false
        },

        // admin
        addNewAdminRequest(state) {
            state.loading = true
        },
        addNewAdminSuccess(state) {
            state.loading = false
        },
        addNewAdminFailed(state) {
            state.loading = false
        }


    }
})

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest())
    await axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/all`)
        .then(res => {
            dispatch(userSlice.actions.fetchAllUsersSuccess(res?.data?.users))
        })
        .catch(err => {
            dispatch(userSlice.actions.fetchAllUsersFailed(err?.response?.data?.message))
        })
}

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest())
    await axios
        .post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/add/new-admin`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            dispatch(userSlice.actions.addNewAdminSuccess(res?.data?.users))
            toast.success(res?.data?.message)
            dispatch(toggleAddNewAdminPopup())
        })
        .catch(err => {
            dispatch(userSlice.actions.addNewAdminFailed(err?.response?.data?.message))
            toast.error(err?.response?.data?.message)
        })
}
export default userSlice.reducer
