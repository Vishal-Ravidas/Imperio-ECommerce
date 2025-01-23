import axios from 'axios';

export async function GET(req) {
  // Extract parameters from the request
  const { searchParams } = new URL(req.url);
  const otp = searchParams.get('otp');
  const mobile = searchParams.get('mobile');
  const authkey = '379219A2BLo5Jrc3Ks62c57623P1';  // Your MSG91 Authkey

  if (!otp || !mobile) {
    return new Response('Missing parameters', { status: 400 });
  }

  const options = {
    method: 'GET',
    url: 'https://control.msg91.com/api/v5/otp/verify',
    params: { otp, mobile },
    headers: { authkey }
  };

  try {
    const { data } = await axios.request(options);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response('Error verifying OTP', { status: 500 });
  }
}
