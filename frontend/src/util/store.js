import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/userSlice";
import connectionSlice from "../store/connectionSlice";

const appStore = configureStore({
    reducer: {
        user: userSlice,
        connections: connectionSlice
    }
});

export default appStore;