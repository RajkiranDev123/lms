import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { toggleAddBookPopup } from "./popUpSlice"
import { toast } from "react-toastify"

const bookSlice = createSlice({
    name: "book",
    initialState: {
        loading: false,
        error: null,
        message: null,

        books: [],
        pageCount: null,
        booksCount: null
    },
    reducers: {
        fetchBooksRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        fetchBooksSuccess(state, action) {
            state.loading = false
            state.books = action.payload
            state.message = null
        },
        fetchBooksFailed(state, action) {
            state.loading = false
            state.error = action.payload
            state.message = null
        },
        setPagesCount(state, action) {
            state.pageCount = action.payload
        },
        setBooksCount(state, action) {
            state.booksCount = action.payload
        },
        //////////////////////////////////////
        addBookRequest(state) {
            state.loading = true
            state.error = null
            state.message = null
        },
        addBookSuccess(state, action) {
            state.loading = false
            state.message = action.payload

        },
        addBookFailed(state, action) {
            state.loading = false
            state.error = action.payload
        },
        ////////////////////////////////////////////////////////
        resetBookSlice(state, action) {
            state.loading = false
            state.error = null
            state.message = null
        }

    }
})

export const fetchAllBooks = (title, page) => async (dispatch) => {
    console.log("fetchAllBooks called!")
    dispatch(bookSlice.actions.fetchBooksRequest())
    await axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/v1/book/all`, {
            headers: {
                "Content-Type": "application/json",
                "page": page,
                "title": title
            }

        })
        .then(res => {
            dispatch(bookSlice.actions.fetchBooksSuccess(res?.data?.books))
            dispatch(bookSlice.actions.setPagesCount(res?.data?.pagination?.pageCount))
            dispatch(bookSlice.actions.setBooksCount(res?.data?.pagination?.totalBooks))
        })
        .catch(err => {
            dispatch(bookSlice.actions.fetchBooksFailed(err?.response?.data?.message))
        })
}

export const addBook = (data) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest())
    await axios
        .post(`${import.meta.env.VITE_BASE_URL}/api/v1/book/admin/add`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            dispatch(bookSlice.actions.addBookSuccess(res?.data?.message))
            toast.success(res?.data?.message)
            dispatch(toggleAddBookPopup())
            dispatch(fetchAllBooks())

        })
        .catch(err => {
            dispatch(bookSlice.actions.addBookFailed(err?.response?.data?.message))
        })
}

export const resetBookSlice = (data) => (dispatch) => {
    dispatch(bookSlice.actions.resetBookSlice())

}

export default bookSlice.reducer