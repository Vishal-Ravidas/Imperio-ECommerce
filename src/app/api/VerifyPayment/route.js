import crypto from 'crypto';

export async function POST(req) {
    console.log("entry");
    try {
        const { orderId, paymentId, signature } = await req.json(); // Expecting orderId, paymentId, and signature in the request body

        // Your Razorpay Secret Key
        const razorpaySecret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET; // Keep this secret

        // Generate the expected signature
        const generatedSignature = crypto
            .createHmac('sha256', razorpaySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        // Verify the signature
        if (generatedSignature === signature) {
            // Signature is valid
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            // Signature is invalid
            return new Response(JSON.stringify({ success: false, message: 'Signature verification failed' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return new Response(JSON.stringify({ success: false, message: 'Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
