"use client";
 
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { H3 } from "components/Typography";
import Scrollbar from "components/scrollbar";
import { TableHeader, TablePagination } from "components/data-table";
import useMuiTable from "hooks/useMuiTable";
import ColorsRow from "../colors-row";
import SearchArea from "../../search-box";
import { tableHeading } from "../table-heading";
import Pagination from "pages-sections/customer-dashboard/pagination";
import { useDispatch, useSelector } from "react-redux";
import { getColor } from "app/store/colorRedux/colorAction";
const ColorsPageView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const rowsPerPage = 8;
 
 
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.color.colorData);
 
  useEffect(() => {
    dispatch(getColor());
  }, [dispatch]);
 
  const [colorsData,setcolorsData] = useState([]);
 
useEffect(()=>{
  setTimeout(()=>{
    setcolorsData(colors)
  },[1000])
 
},[colors])
 
  const filteredColors = colorsData
    .map((item) => ({
      id: item.colorcode,
      slug: item.slug,
      name: item.colorname,
      logo: item.color,
    }))
  .filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const {
    order,
    orderBy,
    selected,
    // rowsPerPage,
    filteredList,
    // handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: filteredColors,
    defaultSort: "name",
  });
 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
 
  const rowsLength = filteredList.length;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const requiredRows = filteredList.slice(indexOfFirstRow, indexOfLastRow);
 
  const handleChangePage = (event, page) => {
    console.log("cateor",page)
    setCurrentPage(page); // Pagination library often expects 0-based index
  };
 
  return (
    <Box py={4}>
      <H3 mb={2}>Product Colors</H3>
 
      <SearchArea
        handleSearch={handleSearch}
        buttonText="Add Colors"
        url="/admin/colors/create"
        searchPlaceholder="Search Color or Hex Code..."
      />
 
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 600 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                numSelected={selected.length}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />
 
              <TableBody>
                {requiredRows.map((color) => (
                  <ColorsRow key={color.id} color={color} selected={selected} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
 
        <Stack alignItems="center" my={4}>
        <Pagination
            count={Math.ceil(rowsLength/rowsPerPage)}
            page={currentPage} // Pagination library often expects 0-based index
            onChange={handleChangePage}
          />
        </Stack>
      </Card>
    </Box>
  );
};
 
export default ColorsPageView;