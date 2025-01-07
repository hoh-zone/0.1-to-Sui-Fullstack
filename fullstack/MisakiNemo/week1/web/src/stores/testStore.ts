import {createSlice, PayloadAction} from "@reduxjs/toolkit";


 const testStore = createSlice({
    name: "testStore",
    initialState: {
        count: 0
    },
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            state.count += action.payload;
        },
        decrement: (state, action: PayloadAction<number>) => {
            state.count -= action.payload;
        }
    }
})

export default testStore;
export const {increment, decrement} = testStore.actions

