import { API_BASE_URL } from "./constant";
import { io } from "socket.io-client";

export const connectionSocketIo = () => {
    return io(API_BASE_URL)
}