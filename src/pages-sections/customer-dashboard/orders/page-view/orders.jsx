"use client";
 
import { Fragment, useEffect, useState } from "react";
import ShoppingBag from "@mui/icons-material/ShoppingBag"; // Local CUSTOM COMPONENTS
 
import OrderRow from "../order-row";
import Pagination from "../../pagination";
import DashboardHeader from "../../dashboard-header"; // CUSTOM DATA MODEL
import { useDispatch, useSelector } from "react-redux";
import { getOrdersFromVendor } from "app/store/vendorRedux/orderRedux/orderAction";
// ====================================================
 
export default function OrdersPageView() {
  const ordersData = useSelector((state) => state.vendorOrders.ordersList);
  const userId = useSelector((state) => state.user.userid);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // You can adjust this as needed
 
  useEffect(() => {
    if (userId) {
      const user = {
        userid: userId
      };
      dispatch(getOrdersFromVendor(user));
    }
  }, [dispatch, userId]); // Add dispatch and userId to the dependency array
 
  const onChangePage = (event, page) => {
    setCurrentPage(page);
  };
 
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = ordersData.slice(indexOfFirstOrder, indexOfLastOrder);
 
  return (
    <Fragment>
      {/* TITLE HEADER AREA */}
      <DashboardHeader Icon={ShoppingBag} title="My Orders" />
 
      {/* ORDER LIST AREA */}
      {currentOrders.length > 0 ? (
        currentOrders.map(order => (
          <OrderRow order={order} key={order.id} />
        ))
      ) : (
        <p>No orders found.</p>
      )}
 
      {/* ORDERS PAGINATION */}
      {ordersData.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(ordersData.length / itemsPerPage)}
          page={currentPage}
          onChange={onChangePage}
        />
      )}
    </Fragment>
  );
}