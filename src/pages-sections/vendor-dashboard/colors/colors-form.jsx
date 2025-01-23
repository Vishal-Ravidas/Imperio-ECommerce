import React, { useState, useEffect } from "react";
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
import { ChromePicker } from "react-color";
import { Modal, Box } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import namer from 'color-namer';
import { useDispatch } from "react-redux";
import { postColor } from "app/store/colorRedux/colorAction";
 
const VALIDATION_SCHEMA = yup.object().shape({
  colorname: yup.string().required("Color name is required"),
  colorcode: yup.string().required("Color code is required").matches(/^#/, "Hex code must start with #"),
});
 
const ColorsForm = (props) => {
  const dispatch = useDispatch();
  const { initialValues, onSearch } = props;
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [colorData, setColorData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
 
  const fetchColorData = async (values) => {
    try {
      const queryParams = new URLSearchParams({
        colorname: values.colorname,
        colorcode: values.colorcode
      }).toString();
 
      const response = await fetch(`/api/colors?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      const result = await response.json();
 
      if (response.ok) {
        setColorData(result.data);
      } else {
        handleSnackbarOpen(`Error: ${result.error}`, "error");
      }
    } catch (error) {
      console.error('Error:', error);
      handleSnackbarOpen(`Unexpected error: ${error}`, "error");
    }
  };
 
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
 
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await dispatch(postColor(values));
      if (response.status === 200) {
        handleSnackbarOpen("Color saved successfully!", "success");
        resetForm();
        setColorData(null);
      } else {
        handleSnackbarOpen("Failed to save color", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      handleSnackbarOpen(`Unexpected error: ${error}`, "error");
    } finally {
      setSubmitting(false);
    }
  };
 
  const suggestColorName = (hexCode) => {
    const names = namer(hexCode);
    return names.ntc[0].name;
  };
 
  const suggestHexCode = (colorName) => {
    const names = namer(colorName);
    let hexCode = names.ntc[0].hex;
    return hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
  };
 
  const ensureHexPrefix = (hexCode) => {
    return hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
  };
 
  useEffect(() => {
    if (initialValues.colorname && initialValues.colorcode) {
      fetchColorData(initialValues);
    }
  }, [initialValues]);
 
  return (
    <Card sx={{ p: 6 }}>
      <Formik
        initialValues={{
          colorname: initialValues.colorname || "",
          colorcode: initialValues.colorcode || "",
        }}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="colorname"
                  label="Color Name"
                  color="info"
                  size="medium"
                  placeholder="Enter Color Name"
                  value={values.colorname}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const newColorName = e.target.value;
                    setFieldValue("colorname", newColorName);
                    const suggestedHexCode = suggestHexCode(newColorName);
                    setFieldValue("colorcode", suggestedHexCode);
                  }}
                  error={!!touched.colorname && !!errors.colorname}
                  helperText={touched.colorname && errors.colorname}
                />
              </Grid>
 
              <Grid item sm={6} xs={12}>
                <Box display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    name="colorcode"
                    value={values.colorcode}
                    onChange={(e) => {
                      const newColorCode = ensureHexPrefix(e.target.value);
                      const newColorName = suggestColorName(newColorCode);
                      setFieldValue("colorcode", newColorCode);
                      setFieldValue("colorname", newColorName);
                    }}
                    onBlur={handleBlur}
                    label="Color Code"
                    variant="outlined"
                    size="medium"
                    error={!!touched.colorcode && !!errors.colorcode}
                    helperText={touched.colorcode && errors.colorcode}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setOpenColorPicker(true)}>
                          <ColorLensIcon />
                        </IconButton>
                      )
                    }}
                  />
                </Box>
              </Grid>
 
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} sx={{ mr: 2 }}>
                  Save Color
                </Button>
              </Grid>
              {colorData && (
                <Grid item xs={12}>
                  <Typography variant="h6">Color Data:</Typography>
                  <Card sx={{ p: 2, mt: 2 }}>
                    <Typography variant="body1">
                      <strong>Color Name:</strong> {colorData.colorname}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Color Code:</strong> {colorData.colorcode}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: colorData.colorcode,
                        borderRadius: "4px",
                        mt: 1,
                      }}
                    />
                  </Card>
                </Grid>
              )}
            </Grid>
 
            <Modal
              open={openColorPicker}
              onClose={() => setOpenColorPicker(false)}
              aria-labelledby="color-picker-modal"
              aria-describedby="color-picker-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 4,
                }}
              >
                <Typography
                  id="color-picker-modal"
                  variant="h6"
                  component="h2"
                  gutterBottom
                >
                  Choose Your Color
                </Typography>
                <ChromePicker
                  color={values.colorcode}
                  onChange={(color) => {
                    const newColorCode = ensureHexPrefix(color.hex);
                    const newColorName = suggestColorName(newColorCode);
                    setFieldValue("colorcode", newColorCode);
                    setFieldValue("colorname", newColorName);
                  }}
                />
                <Button
                  onClick={() => setOpenColorPicker(false)}
                  sx={{ mt: 2 }}
                  variant="contained"
                >
                  Done
                </Button>
              </Box>
            </Modal>
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
    </Card>
  );
};
 
export default ColorsForm;