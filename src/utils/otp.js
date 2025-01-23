import axios from 'axios';

export const initiateOtpRequest = async () => {
  try {
    console.log("otpp");
    const response = await axios.post(
      `https://control.msg91.com/api/v5/otp?template_id=6321b96304158c1f5f171763&mobile=918340037893&authkey=379219A2BLo5Jrc3Ks62c57623P1&realTimeResponse=1`,
      {
        Param1: 'value1',
        Param2: 'value2',
        Param3: 'value3'
      },
      {
        headers: {
          'Content-Type': 'application/JSON'
        }
      }
    );

    if (response.data.type === 'success') {
      console.log('OTP Request Successful:', response.data);
      return response.data;
    } else {
      throw new Error('OTP Request Failed');
    }
  } catch (error) {
    console.error('Error during OTP request:', error);
    throw error;
  }
};
