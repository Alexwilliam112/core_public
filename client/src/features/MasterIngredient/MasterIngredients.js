import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    masterIngredients: [],
    loading: false,
    error: ""
};

export const masterIngredientSlice = createSlice({

    name: "masterIngredients",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.masterIngredients = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.masterIngredients = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.masterIngredients = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = masterIngredientSlice.actions;

export const fetchAllMasterIngredients = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/inventory/ingredients`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default masterIngredientSlice.reducer;
