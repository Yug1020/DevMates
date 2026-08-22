import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/userSlice";

const appStore = configureStore({
    reducer: {
        user: userSlice
    }
});

export default appStore;