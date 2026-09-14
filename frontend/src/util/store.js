import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/userSlice";
import connectionSlice from "../store/connectionSlice";
import notificationSlice from "../store/notifications";

const appStore = configureStore({
    reducer: {
        user: userSlice,
        connections: connectionSlice,
        notifications: notificationSlice
    }
});

export default appStore;