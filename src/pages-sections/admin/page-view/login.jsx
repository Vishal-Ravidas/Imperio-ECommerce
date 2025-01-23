"use client";

import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup"; // LOCAL CUSTOM COMPONENTS
import "bootstrap/dist/css/bootstrap.min.css";
import EyeToggleButton from "../components/eye-toggle-button"; // LOCAL CUSTOM HOOK

import usePasswordVisible from "../use-password-visible"; // GLOBAL CUSTOM COMPONENTS

import BazaarTextField from "components/BazaarTextField"; // ==============================================================
import { useDispatch } from "react-redux";
import { use } from "i18next";
import { adminLogin } from "app/store/adminRedux/adminLoginAction";
import { useState } from "react";
import { useEffect } from "react";
// ==============================================================

const LoginPageView = ({ closeDialog }) => {
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showModal, setShowModal] = useState(false); // LOGIN FORM FIELDS INITIAL VALUES

  const initialValues = {
    email: "",
    password: "",
  }; // LOGIN FORM FIELD VALIDATION SCHEMA

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    // handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    // onSubmit: values => {
    //   closeDialog?.();
    // }
  });
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // const adminDetails={
    //   email:values.email,
    //   password:values.password
    // }
    // console.log(adminDetails)  
    dispatch(adminLogin(values))
      .then((response) => {
        console.log("data of response success", typeof response.success);

        if (response.success == "true") {
          setLoginError("");
          console.log("Login successful:", response);
        } else {
          setLoginError("Incorrect email or password. Please try again.");
          // setShowModal(true);
          console.log("Login failed:", response);
        }
      })
      .catch((error) => {
        setLoginError("An error occurred. Please try again.");
        setShowModal(true);
        console.log("Error during login:", error);
      });
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

  return (
    <>
      {/* <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="myModal"
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none", }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="row">
              <div className="col-md-4"> </div>
              <div className="col-md-4">
                {" "}
                <div className=" text-center " style={{ borderRadius: "8px" }}>
                  <p
                    style={{
                      color: "red",
                      fontSize: "10px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                    }}
                  >
                    {loginError}
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: "13px", padding: '10px 25px 10px 25px' }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="col-md-4"> </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div
  className={`modal fade ${showModal ? "show" : ""}`}
  id="myModal"
  tabIndex="-1"
  role="dialog"
  style={{ 
    display: showModal ? "block" : "none",
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1050,
    transition: 'background-color 0.3s ease-out'
  }}
>
  <div className="modal-dialog modal-dialog-centered" role="document" style={{
    transition: 'transform 0.3s ease-out',
    transform: showModal ? 'none' : 'translate(0, -50px)'
  }}>
    <div className="modal-content" style={{
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      border: 'none',
      backgroundColor: '#ffffff'
    }}>
      <div className="modal-body text-center" style={{
        padding: '24px'
      }}>
        <p style={{
          color: "#dc3545",
          fontSize: "16px",
          fontWeight: "500",
          marginBottom: "20px"
        }}>
          {loginError}
        </p>
        <button
          type="button"
          className="btn btn-danger"
          style={{ 
            fontSize: "14px", 
            padding: '10px 25px',
            borderRadius: '6px',
            backgroundColor: isButtonHovered ? '#bb2d3b' : '#dc3545',
          color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div> */}

      <div className="container " style={{ marginTop: "13%" }}>
        <div className="row">
          <div className="col-md-4"></div>
          <div
            className="col-md-4 p-4 rounded"
            style={{
              border: "1px solid transparent",
              boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="row text-center mb-3 " style={{ color: "black" }}>
              <h5 className="fw-bold">Admin Login</h5>
            </div>
            <form onSubmit={handleAdminSubmit}>
              <BazaarTextField
                mb={1.5}
                fullWidth
                name="email"
                size="small"
                type="email"
                variant="outlined"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                label="Email or Phone Number"
                placeholder="exmple@mail.com"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <BazaarTextField
                mb={2}
                fullWidth
                size="small"
                name="password"
                label="Password"
                autoComplete="on"
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                placeholder="*********"
                type={visiblePassword ? "text" : "password"}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <EyeToggleButton
                      show={visiblePassword}
                      click={togglePasswordVisible}
                    />
                  ),
                }}
              />
            

              <Button
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
                size="large"
                // target="#myModal"
              >
                Login
              </Button>
              <div className=" mt-3 text-center fw-semibold text-danger " style={{}}>
             {loginError}
             </div>
            </form>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </>
  );
};

export default LoginPageView;