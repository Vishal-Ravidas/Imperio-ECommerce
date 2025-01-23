"use client";
 
import { useState, useEffect } from "react";
import { ColorsPageView } from "pages-sections/vendor-dashboard/colors/page-view";
import { useSelector, useDispatch } from "react-redux";
import { getColor } from "app/store/colorRedux/colorAction";
 
export default function Colors() {
 
 
  return <ColorsPageView />;
}
 