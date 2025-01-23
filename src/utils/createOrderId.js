import axios from 'axios';

export const createOrderId = async (amount) => {
    console.log("Creating order ID...");
    try {
        const response = await axios.post('/api/CreateOrder', { amount });

        // Return an object containing the order ID and status code
        return {
            status: response.status,
            orderId: response.data.orderId
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);

        // Return an object with an error status code and message
        return {
            status: error.response ? error.response.status : 500,
            message: 'Failed to create order ID'
        };
    }
};
