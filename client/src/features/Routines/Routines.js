import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    routines: [],
    loading: false,
    error: ""
};

export const routineSlice = createSlice({

    name: "routines",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.routines = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.routines = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.routines = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = routineSlice.actions;

export const fetchAllRoutines = () => async (dispatch) => {
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

export default routineSlice.reducer;
