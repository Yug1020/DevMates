import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice(
    {
        name:"connections",
        initialState: [],
        reducers:{
            setNetworkList:(state, action) => {
                return Array.isArray(action.payload) ? action.payload : []
            },
            resetNetworkList:() => {
                return []
            }
        }
    }
)
export const {setNetworkList, resetNetworkList} = connectionSlice.actions;

export default connectionSlice.reducer;
