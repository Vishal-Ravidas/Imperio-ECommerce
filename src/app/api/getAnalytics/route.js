import https from 'https';

export async function GET(req) {
  // Replace these with actual values
  const startDate = '2024-09-26';  // Specify start date if needed
  const endDate = '2024-09-27';    // Specify end date if needed
  const authkey = '379219A2BLo5Jrc3Ks62c57623P1';  // Your MSG91 Authkey

  const options = {
    method: 'GET',
    hostname: 'control.msg91.com',
    port: null,
    path: `/api/v5/report/analytics/p/otp?startDate=${startDate}&endDate=${endDate}&authkey=${authkey}`,
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
      reject(new Response('Error fetching analytics', { status: 500 }));
    });

    request.end();
  });
}
