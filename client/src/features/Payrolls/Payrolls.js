import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    payrolls: [],
    loading: false,
    error: ""
};

export const payrollSlice = createSlice({

    name: "payrolls",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.payrolls = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.payrolls = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.payrolls = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = payrollSlice.actions;

export const fetchAllPayrolls = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/expenses/payroll`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default payrollSlice.reducer;
