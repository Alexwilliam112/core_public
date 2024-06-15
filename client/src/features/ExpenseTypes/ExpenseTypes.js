import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    expenseTypes: [],
    loading: false,
    error: ""
};

export const expenseTypeSlice = createSlice({

    name: "expenseTypes",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.expenseTypes = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.expenseTypes = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.expenseTypes = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = expenseTypeSlice.actions;

export const fetchAllExpenseTypes = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/expenses/expenseTypes`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default expenseTypeSlice.reducer;
