import { API_BASE_URL } from "./constant";
import { io } from "socket.io-client";

export const connectionSocketIo = () => {
    if(location.hostname === "localhost"){
        return io(API_BASE_URL)
    }
    else{
        return io("/", { path: "/api/socket.io" })
    }
};