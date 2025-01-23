import https from 'https';

export async function POST(req) {
  const otpExpiry = '10';  // OTP expiration time in minutes
  const templateId = '6321b96304158c1f5f171763';  // Your MSG91 template ID
  const mobile = '918340037893';  // The mobile number to send the OTP to
  const authkey = '379219A2BLo5Jrc3Ks62c57623P1';  // Your MSG91 Authkey
  const realTimeResponse = '1';  // Set to '1' for real-time response

  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    port: null,
    path: `/api/v5/otp?otp_expiry=${otpExpiry}&template_id=${templateId}&mobile=${mobile}&authkey=${authkey}&realTimeResponse=${realTimeResponse}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      const chunks = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        resolve(new Response(body, { status: 200 })); // Return the response with status 200
      });
    });

    request.on('error', (error) => {
      reject(new Response('Error sending OTP', { status: 500 }));
    });

    request.write('{}'); // Send an empty body
    request.end();
  });
}
