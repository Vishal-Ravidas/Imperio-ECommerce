import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { postSize } from "app/store/sizeRedux/sizeAction";
 
// FORM FIELDS VALIDATION SCHEMA
const VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Size Name is required!"),
});
 
const SizeForm = props => {
  const { initialValues } = props;
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
 
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
 
  return (
    <>
      <Formik
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            const response = await dispatch(postSize(values));
            console.log(response.status,"jaya")
            if (response.status ===true) {
              console.log('hlooo')
              handleSnackbarOpen("Size saved successfully!", "success");
              resetForm();
            } else {
              handleSnackbarOpen("Failed to save size", "error");
            }
          } catch (error) {
            console.error('Error:', error);
            handleSnackbarOpen(`Unexpected error: ${error}`, "error");
          }
          setSubmitting(false);
        }}
        initialValues={initialValues || { name: '' }}
        validationSchema={VALIDATION_SCHEMA}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Card sx={{ p: 3, m: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Size Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Save Size
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </form>
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
    </>
  );
};
 
export default SizeForm;