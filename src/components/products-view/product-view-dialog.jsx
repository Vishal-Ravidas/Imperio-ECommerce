import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent"; // MUI ICON COMPONENTS

import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove"; // GLOBAL CUSTOM COMPONENTS

import { FlexBox } from "components/flex-box";
import { Carousel } from "components/carousel";
import BazaarImage from "components/BazaarImage";
import { H1, H2, H3, H6, Paragraph } from "components/Typography"; // LOCAL CUSTOM HOOKS

import useCart from "hooks/useCart"; // CUSTOM UTILS LIBRARY FUNCTION

import { currency } from "lib"; // =====================================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "app/store/UserCartRedux/UserCartAction";


// =====================================================
export default function ProductViewDialog(props){
  const {
    product,
    openDialog,
    handleCloseDialog
  } = props;
  const {
    state,
    dispatch
  } = useCart();
  const cartItem = state.cart.find(item => item.id === product.id);
  const cartData=useSelector((state)=>state.cartModified.cartData);
  const userValid=useSelector((state)=>state.user.loginVerified);
  const userId=useSelector((state)=>state.user.userid);
  const rate = useSelector(state=>state.rating.ratingDetails);
  const dispatch1=useDispatch();
  let cartqty=0;
  cartData.map((item)=>{
    if(item.productid==product.id)
    {
      cartqty=item.quantity;
    }
  })
  console.log("product details",product)

  useEffect(()=>{},[rate,cartData,userValid])

  const handleCartAmountChange = amount => () => {
    if(userValid)
    {
      console.log("amount",typeof(Number(amount)))
      const productData = {
        id:product.id,
        userid: userId,
        qty: amount,
        remainingqty: 0,
      };
    dispatch1(addProductToCart(productData));
   }
   else{
    router.push("/login");
   }
  };

  return <Dialog open={openDialog} maxWidth={false} onClose={handleCloseDialog} sx={{
    zIndex: 1501
  }}>
      <DialogContent sx={{
      maxWidth: 900,
      width: "100%"
    }}>
        <div>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Carousel slidesToShow={1} arrowStyles={{
              boxShadow: 0,
              color: "primary.main",
              backgroundColor: "transparent"
            }}>
                {product.imgGroup.map((item, index) => <BazaarImage key={index} src="/assets/images/furniture-products/b-3.png" alt="product" sx={{
                mx: "auto",
                width: "100%",
                objectFit: "contain",
                height: {
                  sm: 400,
                  xs: 250
                }
              }} />)}
              </Carousel>
            </Grid>

            <Grid item md={6} xs={12} alignSelf="center">
              <H2>{product.title}</H2>

              {/* <Paragraph py={1} color="grey.500" fontWeight={600} fontSize={13}>
                CATEGORY: Cosmetic
              </Paragraph> */}

              <H1 color="primary.main">{currency(product.currentprice)}</H1>

              <FlexBox alignItems="center" gap={1} mt={1}>
              <Rating color="warn" value={Number(rate)} readOnly />
              <H6 lineHeight="1">{Number(rate)}</H6>
              </FlexBox>

              {/* <Paragraph my={2}>
                {product.specs}
              </Paragraph> */}

              <Divider sx={{
              mb: 2
            }} />

{(cartqty<=0)?
            <Button color="primary" variant="contained" onClick={handleCartAmountChange(cartqty + 1)} sx={{
            mb: 4.5,
            px: "1.75rem",
            height: 40
          }}>
                Add to Cart
              </Button> :
               <FlexBox alignItems="center" mb={4.5}>
                <Button size="small" sx={{
              p: 1
            }} color="primary" variant="outlined" onClick={handleCartAmountChange(cartqty - 1)}>
                  <Remove fontSize="small" />
                </Button>

                <H3 fontWeight="600" mx={2.5}>
                {cartqty}
                </H3>

                <Button size="small" sx={{
              p: 1
            }} color="primary" variant="outlined" onClick={handleCartAmountChange(Number(cartqty) + 1)}>
                  <Add fontSize="small" />
                </Button>
              </FlexBox>}
            </Grid>
          </Grid>
        </div>

        <IconButton sx={{
        position: "absolute",
        top: 3,
        right: 3
      }} onClick={handleCloseDialog}>
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>;
}