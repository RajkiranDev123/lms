import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const metaSlice = createSlice({
    name: "meta",
    initialState: {
        metaData: {},
        loading: false,
        error: null,
        message: null,
        downloading: false,
    

    },
    reducers: {
   
        requestForMeta(state, action) {
            state.loading = true;
            state.error = null;
        },
        successForMeta(state, action) {
            state.loading = false;
            state.error = null;
            state.metaData = action.payload.counts;
        },
        failureForMeta(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        //
        requestForPdf(state, action) {
            state.downloading = true;
            state.error = null;
        },
        successForPdf(state, action) {
            state.downloading = false;
            state.error = null;
        },
        failureForPdf(state, action) {
            state.downloading = false;
            state.error = action.payload;
        },

        clearAllErrors(state, action) {
            state.error = null;
            state.metaData = state.metaData;
 
        },
        resetMetaSlice(state, action) {
            state.error = null;
            state.metaData = state.metaData;
            state.message = null;
            state.loading = false;
        },
    },
});




//meta user

export const fetchMetaDataUser = (date) => async (dispatch) => {

    dispatch(metaSlice.actions.requestForMeta());
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/meta/user`,
            {
                withCredentials: true,
                headers: {
                    "date-range": date
                }
            }
        );
        dispatch(metaSlice.actions.successForMeta(response?.data));
        dispatch(metaSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(
            metaSlice.actions.failureForMeta(
                error.response.data.message
            )
        );
    }
};


//meta admin
export const fetchMetaDataAdmin = (date) => async (dispatch) => {

    dispatch(metaSlice.actions.requestForMeta());
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/meta/admin`,
            {
                withCredentials: true,
                headers: {
                    "date-range": date
                }
            }
        );
        dispatch(metaSlice.actions.successForMeta(response?.data));
        dispatch(metaSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(
            metaSlice.actions.failureForMeta(
                error.response.data.message
            )
        );
    }
};



//pdf download
export const pdfDownload = (url) => async (dispatch) => {

    dispatch(metaSlice.actions.requestForPdf());
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/meta/pdf`,
            {
                withCredentials: true,
                headers: {
                    // "url": url
                }
            }
        );

        window.open(response?.data?.downloadUrl, "blank")

        dispatch(metaSlice.actions.successForPdf());
        dispatch(metaSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(
            metaSlice.actions.failureForPdf(
                error.response.data.message
            )
        );
    }
};




export const clearMetaErrors = () => (dispatch) => {
    dispatch(metaSlice.actions.clearAllErrors());
};

export const resetMetaSlice = () => (dispatch) => {
    dispatch(metaSlice.actions.resetMetaSlice());
};

export default metaSlice.reducer;