import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { url } from "../../router/router";

const initialState = {
    menus: [],
    loading: false,
    error: ""
};

export const menusSlice = createSlice({

    name: "menus",

    initialState,

    reducers: {

        fetchPending(state) {
            state.loading = true;
            state.menus = []
            state.error = ""
        },
        fetchSuccess(state, action) {
            state.loading = false
            state.menus = action.payload
            state.error = ""
        },
        fetchReject(state, action) {
            state.loading = false
            state.menus = []
            state.error = action.payload
        },
    }
})

export const { fetchPending, fetchSuccess, fetchReject } = menusSlice.actions;

export const fetchAllMenus = () => async (dispatch) => {
    try {
        dispatch(fetchPending())

        const { data } = await axios.get(`${url}/inventory/menus`, {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        });

        dispatch(fetchSuccess(data.data))

    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export default menusSlice.reducer;
