import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import FormControlLabel from "@mui/material/FormControlLabel";
import Heading from "./heading";
import LazyImage from "components/LazyImage";
import { FlexBox } from "components/flex-box";
import { Paragraph } from "components/Typography";
import { months, years } from "data/months-years";
import { useDispatch,useSelector } from "react-redux";
import { postOrder } from "app/store/placeorderRedux/placeorderAction";
import { initiateRazorpayPayment } from "utils/razorpay";
import { createOrderId } from "utils/createOrderId";
import { initiateOtpRequest } from "utils/otp";

// payment popup by shiva
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import DialogContentText from "@mui/material/DialogContentText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { postSelectedAddress } from "app/store/placeAddressRedux/placeAddressAction";
// 


const PaymentDetails = ({
  values,
  errors,
  touched,
  handleChange,
  toggleHasVoucher,
  handleFieldValueChange
}) => {
  // payment by shiva
  const [openPopup, setOpenPopup] = useState(false);
  // 
  const [isCardInfoOpen, setIsCardInfoOpen] = useState(false);
  const [isUPIOpen, setIsUPIOpen] = useState(false);
  const [isNetBankingOpen, setIsNetBankingOpen] = useState(false);
  const [isWalletsOpen, setIsWalletsOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const dispatch = useDispatch();


  const cartData = useSelector((state) => state.cartModified.cartData);
  const selectedAddress = useSelector((state) => state.holdSelectedAddress.holdAddressData);

  useEffect(()=>{
    dispatch(postSelectedAddress());
    
  },[]);

  useEffect(()=>{
    console.log("data changed",cartData.length,selectedAddress);
  },[cartData,selectedAddress]);



  const toggleSection = (section) => {
    switch (section) {
      case "cardInfo":
        setIsCardInfoOpen(!isCardInfoOpen);
        break;
      case "upi":
        setIsUPIOpen(!isUPIOpen);
        break;
      case "netBanking":
        setIsNetBankingOpen(!isNetBankingOpen);
        break;
      case "wallets":
        setIsWalletsOpen(!isWalletsOpen);
        break;
      case "voucher":
        setIsVoucherOpen(!isVoucherOpen);
        break;
      default:
        break;
    }
  };


  // payment popup styles
  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: 15,
      padding: theme.spacing(2),
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    },
  }));
 
  const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    textAlign: "center",
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: "1.5rem",
  }));
 
  const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    textAlign: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  }));
 
  const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    marginTop: theme.spacing(1),
  }));
 
  const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    justifyContent: "center",
    padding: theme.spacing(2),
  }));
 
  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    padding: theme.spacing(1, 4),
  }));
  // 

  // otp request -- To Send Otp
  // const handlePayment = async () => {
  //   try {
  //     const response = await fetch('/api/sendOtpp', { // Ensure this matches your API route
  //       method: 'POST', // Ensure this is set to 'POST'
  //     });
  //     const data = await response.json();
      
  //     if (response.ok) {
  //       console.log('OTP sent successfully:', data.message);
  //     } else {
  //       console.error('Error:', data.error);
  //     }
  //   } catch (error) {
  //     console.error('Request failed:', error.message);
  //   }
  // };
  

    // handleResendOtp -- To Resend Otp
    // const handlePayment = async () => {
    //   try {
    //     const response = await fetch('/api/resendOtp', {
    //       method: 'GET', // Ensure this is set to 'GET'
    //     });
    //     const data = await response.json();
    
    //     if (response.ok) {
    //       console.log('Resend OTP response:', data);
    //     } else {
    //       console.error('Error:', data.error);
    //     }
    //   } catch (error) {
    //     console.error('Request failed:', error.message);
    //   }
    // };

    // handleVerifyOtp
    // const handlePayment = async (otp, mobile) => {
    //   try {
    //     const response = await fetch(`/api/verifyCode?otp=${otp}&mobile=${mobile}`, {
    //       method: 'GET', // Ensure this is set to 'GET'
    //     });
    //     const data = await response.json();
    
    //     if (response.ok) {
    //       console.log('OTP Verification Response:', data);
    //       // Handle successful OTP verification here
    //     } else {
    //       console.error('Error:', data);
    //     }
    //   } catch (error) {
    //     console.error('Request failed:', error.message);
    //   }
    // };

    
  // handleGetAnalytics -- To recieve all otp data by date
  //  const handlePayment = async () => {
  // try {
  //   const response = await fetch('/api/getAnalytics', {
  //     method: 'GET', // Ensure this is set to 'GET'
  //   });
  //   const data = await response.json();

  //   if (response.ok) {
  //     console.log('Analytics data:', data);
  //   } else {
  //     console.error('Error:', data.error);
  //   }
  // } catch (error) {
  //   console.error('Request failed:', error.message);
  // }
  // };
    







  // Test On RazorPay
  const handlePayment = async () => {
    console.log("helloRazor");
    let sum=0;
    // calculate amount
    for(let i = 0; i < cartData.length; i++) {
      console.log((cartData[i].currentprice) * (cartData[i].quantity), "price");
      sum+=(cartData[i].currentprice) * (cartData[i].quantity);
    }
  
    try {
      // Create the order ID
      let response = await createOrderId(sum); // Use 1000 paise (₹10.00)
      console.log(response, "orderId"); // Log the order ID
      if(response.status==201)
      {
        let result = await initiateRazorpayPayment(response.orderId);
        console.log(result,"ress");
        if(result.sucess==true)
        {
          dispatch(postOrder(cartData));
          setOpenPopup(true);
          // console.log("card by shive payment hover");
        }
      }
  
      // If you just want to stop here, you can return or do nothing else
      return;
    } catch (error) {
      console.error('Error creating order ID:', error);
    }
  };
  // 
  const onClickPlaceOrder =  () => {
    console.log("ffff",cartData)
    dispatch(postOrder(cartData));
   alert("orderPlacedSuccessfully")
 }

  return (
    <>
    <Card sx={{ p: 3, mb: 3 }}>
        <Heading number={3} title="Payment-Details" />

      {/* COD */}
      <Box mb={3}>
        <ButtonBase
          disableRipple
          onClick={() => toggleSection("wallets")}
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Cash On Deliery
        </ButtonBase>

        <Collapse in={isWalletsOpen}>
          <FlexBox mt={3} gap={2} maxWidth="400px">
            <p></p>
            <Button variant="contained" color="primary" type="button">
              Apply
            </Button>
          </FlexBox>
        </Collapse>
      </Box>

      {/* Voucher Action Field */}
      <Box mb={3}>
        <ButtonBase
          disableRipple
          onClick={() => toggleSection("voucher")}
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          I have a voucher
        </ButtonBase>

        <Collapse in={isVoucherOpen}>
          <FlexBox mt={3} gap={2} maxWidth="400px">
            <TextField
              fullWidth
              name="voucher"
              value={values.voucher}
              onChange={handleChange}
              placeholder="Enter voucher code here"
            />
            <Button variant="contained" color="primary" type="button">
              Apply
            </Button>
          </FlexBox>
        </Collapse>
      </Box>

      
      <Button fullWidth type="submit" color="primary" variant="contained" onClick={handlePayment} disabled={!(cartData.length > 0 && selectedAddress != null)}>
        Place Orders
      </Button> 


      {/* popup payment by  shiva */}
      <StyledDialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <StyledDialogTitle>Order Placed Successfully</StyledDialogTitle>
        <StyledDialogContent>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <StyledDialogContentText>
            Your order has been placed successfully. Thank you for your
            purchase!
          </StyledDialogContentText>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton
            onClick={() => setOpenPopup(false)}
            color="primary"
            variant="contained"
          >
            CLOSE
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>

    </Card>
    </>
    
  );
};

export default PaymentDetails;
