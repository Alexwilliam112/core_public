import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    buyings: [],
    loading: false,
    error: ""
};

export const buyingSlice = createSlice({

    name: "buyings",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.buyings = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.buyings = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.buyings = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = buyingSlice.actions;

export const fetchAllBuyings = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/expenses/buyings`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default buyingSlice.reducer;
