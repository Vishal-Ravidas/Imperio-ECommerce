import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postSubCategoryFromVendor } from "app/store/vendorRedux/SubCategroyRedux/subCategoryAciton";
import { getCategoriesFromVendor } from "app/store/vendorRedux/CategoryRedux/categoryAction";
 
const VALIDATION_SCHEMA = yup.object().shape({
  subCategoryName: yup.string().required("Name required"),
  status: yup.string().required("Status required"),
  parent: yup.string().required("Parent category required"),
});
 
const SubCategoryForm = () => {
  const dispatch = useDispatch();
  const getCategoriesState = useSelector((state) => state.vendorCategory.categoryList);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
 
  useEffect(() => {
    dispatch(getCategoriesFromVendor());
  }, [dispatch]);
 
  const handleSnackbarOpen = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
 
  const getSnackbarColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };
 
  const getSnackbarIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />;
      case 'error':
        return <ErrorOutlineIcon sx={{ marginRight: 1 }} />;
      default:
        return <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />;
    }
  };
 
  const initialValues = { subCategoryName: '', status: '', parent: '' };
 
  return (
    <Card sx={{ p: 6 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          const subCategoryData = {
            categoryId: values.parent,
            subcategoryName: values.subCategoryName,
            subcategoryStatus: values.status
          };
          try {
            setSubmitting(true);
            const response = await dispatch(postSubCategoryFromVendor(subCategoryData));
            if (response.status === 200) {
              handleSnackbarOpen("Subcategory added successfully", "success");
              resetForm();
            } else {
              handleSnackbarOpen("Failed to add subcategory", "error");
            }
          } catch (error) {
            handleSnackbarOpen("Failed to add subcategory", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="parent"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.parent}
                  label="Select Parent Category"
                  error={touched.parent && !!errors.parent}
                  helperText={touched.parent && errors.parent}
                >
                  {getCategoriesState.map((category) => (
                    <MenuItem
                      key={category.categoryid}
                      value={category.categoryid}
                    >
                      {category.categoryname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
 
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="subCategoryName"
                  label="Name"
                  color="info"
                  size="medium"
                  value={values.subCategoryName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.subCategoryName && !!errors.subCategoryName}
                  helperText={touched.subCategoryName && errors.subCategoryName}
                />
              </Grid>
 
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.status}
                  label="Select Status"
                  error={touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
 
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="info"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save subcategory
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
 
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: getSnackbarColor(snackbarType),
          color: 'white',
          padding: '6px 16px',
          borderRadius: '4px',
          boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)',
        }}>
          {getSnackbarIcon(snackbarType)}
          <Typography variant="body2">{snackbarMessage}</Typography>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
            sx={{ marginLeft: 'auto' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Card>
  );
};
 
export default SubCategoryForm;