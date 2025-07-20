import { createSlice } from "@reduxjs/toolkit";


const popupSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
        deleteBookPopup: false,
        bookIdToDelete: null
    },
    reducers: {
        toggleSettingPopup(state) {
            state.settingPopup = !state.settingPopup
        },
        toggleAddBookPopup(state) {
            state.addBookPopup = !state.addBookPopup
        },
        toggleReadBookPopup(state) {
            state.readBookPopup = !state.readBookPopup
        },
        toggleRecordBookPopup(state) {
            state.recordBookPopup = !state.recordBookPopup
        },
        toggleReturnBookPopup(state) {
            state.returnBookPopup = !state.returnBookPopup
        },
        toggleAddNewAdminPopup(state) {
            state.addNewAdminPopup = !state.addNewAdminPopup
        },
        toggleDeleteBookPopup(state) {
            state.deleteBookPopup = !state.deleteBookPopup
            state.bookIdToDelete=action?.payload || null
        },
        closeAllPopup(state) {
            state.settingPopup = false,
                state.addBookPopup = false,
                state.readBookPopup = false,
                state.recordBookPopup = false,
                state.returnBookPopup = false,
                state.addNewAdminPopup = false
        }
    }
})

export const { closeAllPopup, toggleSettingPopup, toggleAddBookPopup,
    toggleReadBookPopup, toggleRecordBookPopup, toggleReturnBookPopup, toggleAddNewAdminPopup,toggleDeleteBookPopup
} = popupSlice.actions
export default popupSlice.reducer