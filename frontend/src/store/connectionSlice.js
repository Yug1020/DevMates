import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice(
    {
        name:"Connections",
        initialState:{},
        reducers:{
            setNetworkList:(state, action) => {
                return action.payload
            },
            resetNetworkList:() => {
                return null
            }
        }
    }
)
export const {setNetworkList, resetNetworkList} = connectionSlice.actions;

export default connectionSlice.reducer;