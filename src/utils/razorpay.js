import axios from 'axios';

export const initiateRazorpayPayment = (orderId) => {
    return new Promise((resolve, reject) => {
        console.log("Razorpay payment initiated", orderId);

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
                amount: "1", // Amount in paise (₹1000)
                currency: "INR",
                name: "SSDEV",
                order_id: orderId, // Actual Order ID from Razorpay
                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    try {
                        // Call your API to verify the signature
                        const verificationResponse = await axios.post('/api/VerifyPayment', {
                            orderId: razorpay_order_id,
                            paymentId: razorpay_payment_id,
                            signature: razorpay_signature,
                        });

                        const data = verificationResponse.data;

                        if (data.success) {
                            // alert("Payment Successful!");
                            resolve({sucess:true,transaction:response});
                        } else {
                            // alert("Payment Verification Failed: " + data.message);
                            reject("failed");
                        }
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        reject("Error verifying payment");
                    }
                },
                prefill: {
                    name: "Samuel",
                    email: "sam@ssdev.com",
                    contact: "1234567890",
                },
                notes: {
                    address: "Mangaldas Nagar Guntur",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);

            rzp1.on("payment.failed", function (response) {
                alert("Payment Failed: " + response.error.description);
                reject("Payment Failed: " + response.error.description);
            });

            rzp1.open();
        };

        script.onerror = () => {
            alert("Failed to load Razorpay SDK");
            reject("Failed to load Razorpay SDK");
        };
    });
};
