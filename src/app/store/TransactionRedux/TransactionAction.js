import * as requestFromServer from './TransactionsCRUD'
import { getTransactionData } from './TransactionSlice';

export const postTransaction = (data) => async (dispatch) => {
    try {
        const response=await requestFromServer.postTransaction(data);
    } catch (error) {
        console.error("Error in action:", error);
    }
};

export const getTransaction= () => async (dispatch) => {
    try {
        const response=await requestFromServer.getTransaction();
        dispatch(getTransactionData(response));
    } catch (error) {
    }
};

export const putTransaction= (data) => async (dispatch) => {
    try {
        const response=await requestFromServer.putTransaction(data);
    } catch (error) {
    }
};

export const deleteTransaction= (data) => async (dispatch) => {
    try {
        const response=await requestFromServer.deleteTransaction(data);
    } catch (error) {
    }
};