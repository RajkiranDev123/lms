import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-toastify"

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

