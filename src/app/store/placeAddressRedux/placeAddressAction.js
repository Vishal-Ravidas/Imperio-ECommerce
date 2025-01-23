import { getCartProducts } from '../UserCartRedux/UserCartAction';
import { holdAddressDetails} from './placeAddressSlice'; // Ensure correct import


export const postSelectedAddress = (data) => async (dispatch) => {
    try {
        dispatch(holdAddressDetails(data))
    } catch (error) {
        console.error("Error in action:", error);
    }
};

