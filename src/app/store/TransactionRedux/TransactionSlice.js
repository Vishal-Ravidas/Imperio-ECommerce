import { createSlice } from "@reduxjs/toolkit";

const inintialTransactions={
    transactionDetails:[]
}

const transactionSlice= createSlice({
    name: 'transaction',
    initialState: inintialTransactions,
    reducers: {
    postTransactionData : (state,action) => {
    },
    getTransactionData : (state,action) => {
        state.transactionDetails = action.payload;
    },
    deleteTransactionData : (state,action) => {
    },
    putTransactionData : (state,action) => {
        state.transactionDetails = action.payload;
    }   
}
})

export const {postTransactionData,getTransactionData,deleteTransactionData,putTransactionData} = transactionSlice.actions;
export default transactionSlice.reducer;