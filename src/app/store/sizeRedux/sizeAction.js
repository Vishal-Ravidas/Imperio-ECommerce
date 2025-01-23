import * as requestFromServer from './sizeCrud';
import {postSizeData , getSizeData, deleteSizeData} from './sizeSlice';

export const postSize = (data) => async (dispatch) => {
    try {
        const response = await requestFromServer.postSizeDetails(data);
        console.log(   true,"heh");
        if(response.success==="true"){
            dispatch(postSizeData(response.data));
        }
        return {status:response.success}
    } catch (error) {
        console.error("Error in action:", error);
    }
};

export const getSize = () => async (dispatch) => {
    try {
        const response = await requestFromServer.getSizeDetails();
        // Dispatch the action with the response data
        dispatch(getSizeData(response.sizes));
    } catch (error) {
        console.error("Error in action:", error);
    }
};

export const deleteSize = (data) => async (dispatch) => {
    try {
        const response = await requestFromServer.deleteSizeDetails(data);
        // Dispatch the action with the response data
        console.log(response.success,"hah");
        if(response.success){
            dispatch(deleteSizeData(response.id));
        }
        return{status:response.success}
    } catch (error) {
        console.error("Error in action:", error);
    }
};