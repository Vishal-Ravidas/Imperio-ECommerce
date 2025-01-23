import https from 'https';

export async function GET(req) {
  // Replace these with actual values
  const authkey = '379219A2BLo5Jrc3Ks62c57623P1';  // Your MSG91 Authkey
  const retryType = 'text'; // Specify retry type if needed
  const mobile = '918340037893'; // Mobile number to resend OTP

  const options = {
    method: 'GET',
    hostname: 'control.msg91.com',
    port: null,
    path: `/api/v5/otp/retry?authkey=${authkey}&retrytype=${retryType}&mobile=${mobile}`,
    headers: {}
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
      reject(new Response('Error resending OTP', { status: 500 }));
    });

    request.end();
  });
}
