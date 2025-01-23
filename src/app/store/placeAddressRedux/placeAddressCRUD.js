import axios from 'axios';



export const postPlaceAddress = async (data) => {
    return await axios.post('/api/inv', data );
};

