import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import FlexRowCenter from "components/flex-box/flex-row-center";
import useOverflowDetect from "hooks/useOverflowDetect";
import Link from "next/link";
import { MenusContainer, Wrapper } from "./styles";
import { H6 } from "components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesFromVendor } from "app/store/vendorRedux/CategoryRedux/categoryAction";

// ===============================================================
const MegaMenu = ({ title }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    dispatch(getCategoriesFromVendor());
  }, [dispatch]);

  const data = useSelector(state => state.vendorCategory.categoryList);
  console.log("Fetched Categories:", data);

     // Converting to Encode for slug
     const encode = (name, id) => {
    
      let encodedid= Buffer.from(id).toString("base64")
      .replace(/\+/g, "-") // Replace '+' with '-' for URL safety
      .replace(/\//g, "_") // Replace '/' with '_' for URL safety
      .replace(/=+$/, ""); // Remove trailing '=' characters
      let slugString = "key=" + encodedid + "&upi="+name; // Adding Remaining Text and encoded id
      return slugString;
    };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const STYLE = {
    py: 1.5, // Increase vertical padding for better visibility
    px: 2,
    cursor: 'pointer',
    ":nth-of-type(odd)": {
      backgroundColor: "grey.100"
    },
    ":hover": {
      backgroundColor: "grey.200" // Highlight on hover
    }
  };

  const {
    elementRef,
    isLeftOverflowing,
    isRightOverflowing,
  } = useOverflowDetect();

  return (
    <Wrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link href="/products">
        <FlexRowCenter alignItems="flex-end" gap={0.3}>
          <H6>{title}</H6>
          <KeyboardArrowDown />
        </FlexRowCenter>
      </Link>

      {isHovered && (
        <MenusContainer ref={elementRef} className="menu-list" left={isLeftOverflowing} right={isRightOverflowing}>
          <Card className="card" elevation={2} sx={{ mt: 1,padding:'10px', marginInlineStart:'460px', width: '150px', maxHeight: '300px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.slice(0, 4).map((category, key) => (
                
                <div key={key} style={{marginTop:'10px'}}>
                  <Link href={`/products?${encode(category.categoryname,category.categoryid)}`}><H6 mb={1}>{category.categoryname}</H6></Link>
                </div>
              ))}
            </div>
          </Card>
        </MenusContainer>
      )}
    </Wrapper>
  );
}

export default MegaMenu;
