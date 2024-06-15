import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    sales: [],
    loading: false,
    error: ""
};

export const salesSlice = createSlice({

    name: "sales",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.sales = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.sales = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.sales = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = salesSlice.actions;

export const fetchAllSales = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/operations/sales`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default salesSlice.reducer;
