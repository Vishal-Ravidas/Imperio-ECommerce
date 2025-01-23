import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export async function POST(req) {
    try {
        const { amount, userId } = await req.json(); // Expecting amount and userId in the request body

        // Razorpay API credentials
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

        // Create order data for Razorpay
        const orderData = {
            amount: amount * 100, // amount in paise (e.g., 1000 for ₹10)
            currency: "INR",
            receipt: `receipt#${userId}`, // Customize as needed
            notes: {
                userId: userId // You can store additional info
            }
        };

        // Create order with Razorpay
        const response = await axios.post('https://api.razorpay.com/v1/orders', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
            }
        });

        // Respond with the Razorpay order ID
        return new Response(JSON.stringify({ orderId: response.data.id }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return new Response("Error creating order", {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
