import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import { scroller } from "react-scroll"; // CUSTOM COMPONENTS

import { FlexBox } from "components/flex-box";
import { H2, Paragraph } from "components/Typography";
const list = [{
  title: "Niche Demos",
  thumbnail: "/assets/images/landing/niche-demos.png",
  subTitle: "9 Niche shop demos for online store. Super store, Fashion, Electronic, Grocery and etc",
  category: "homepage",
  buttonText: "Browse Demos"
}, {
  title: "Shop Pages",
  thumbnail: "/assets/images/landing/inner-pages.png",
  subTitle: "Clean Shop inner pages. Vendor shop, Sale/discount pages, checkout, cart and etc.",
  category: "shop",
  buttonText: "Browse Pages"
}, {
  title: "User Dashboard",
  thumbnail: "/assets/images/landing/user-dashboard.png",
  subTitle: "Structured user dashboard for managing user account, orders, address and etc.",
  category: "user",
  buttonText: "Browse User Dashboard"
}, {
  title: "Admin Dashboard",
  thumbnail: "/assets/images/landing/admin-dashboard.png",
  subTitle: "30+ Super admin and vendor dashboard interfaces.",
  category: "admin",
  buttonText: "Browse Admin Dashboard"
}]; // ==================================================================

// ==================================================================
export default function Section6({
  handleChangeFilter
}) {
  const handleNavigate = active => () => {
    scroller.scrollTo("section-3", {});
    handleChangeFilter(active);
  };

  return <Box id="get" sx={{
    backgroundColor: "grey.100"
  }}>
      <Container sx={{
      py: 18
    }}>
        <H2 mb={8} fontSize={28} textAlign="center" fontWeight="700" color="secondary.main" textTransform="uppercase">
          What You Get?
        </H2>

        <Grid container spacing={6}>
          {list.map((item, index) => <Grid item md={6} xs={12} key={index}>
              <FlexBox gap={3} sx={{
            flexDirection: {
              sm: "row",
              xs: "column"
            }
          }}>
                <Avatar alt={item.title} src={item.thumbnail} sx={{
              boxShadow: 1,
              borderRadius: "10px",
              height: "auto",
              width: {
                sm: 250,
                xs: "100%"
              }
            }} />

                <FlexBox flexDirection="column" alignItems="flex-start">
                  <H2 fontSize={22} mb={1}>
                    {item.title}
                  </H2>

                  <Paragraph mb={2}>{item.subTitle}</Paragraph>
                  <Box m="auto" />

                  <Button onClick={handleNavigate(item.category)} variant="outlined" color="primary">
                    {item.buttonText}
                  </Button>
                </FlexBox>
              </FlexBox>
            </Grid>)}
        </Grid>
      </Container>
    </Box>;
}