import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    // initialState: {items:[]},
    initialState: [],
    reducers: {
        setNotifications: (state, action) => {
            return action.payload;
            // if (Array.isArray(action.payload)) {
            //     return action.payload;
            // }
            // if (typeof action.payload === 'string') {
            //     if (action.payload === "No messages for you" || !action.payload.trim()) {
            //         return [];
            //     }
            //     return [action.payload];
            // }
            // if (action.payload && Array.isArray(action.payload.messages)) {
            //     return action.payload.messages;
            // }
            // if (action.payload && Array.isArray(action.payload.items)) {
            //     return action.payload.items;
            // }
            // if (action.payload) {
            //     return [action.payload];
            // }
            // return [];
        },
        markNotifications: () => {
            return [];
        }
    }
});

export const { setNotifications, markNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;