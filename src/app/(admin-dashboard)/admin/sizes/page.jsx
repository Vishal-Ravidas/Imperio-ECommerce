"use client";
 
import { useState, useEffect } from "react";
import { SizesPageView } from "pages-sections/vendor-dashboard/sizes/page-view";
import { getSize } from "app/store/sizeRedux/sizeAction";
import { useDispatch, useSelector } from "react-redux";
 
export default function Colors() {
  
 
  return <SizesPageView  />;
}
 