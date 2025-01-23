import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik, FieldArray } from "formik";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { updateProductById } from "app/store/vendorRedux/ProductRedux/productAction";
import * as yup from "yup";
import { getColor } from "app/store/colorRedux/colorAction";
import { useParams } from "next/navigation";
import { getProductById } from "app/store/vendorProductRedux/productAction";
import { getSubCategoriesFromVendor } from "app/store/vendorRedux/SubCategroyRedux/subCategoryAciton";
 
// Define your validation schema...
const VALIDATION_SCHEMA = yup.object().shape({
  color: yup.array().of(
    yup.object().shape({
      colorid: yup.string().required("Color is required!"),
      colorname: yup.string().required("Color name is required!"),
    })
  ).min(1, "At least one color is required"),
  productName: yup.string().required("Name is required!").max(500, "Name must be 500 characters or less"),
  description: yup.string().required("Description is required!").min(10, "Description must be at least 10 characters long"),
  specification: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Specification name is required"),
      value: yup.string().required("Specification value is required"),
    })
  ).min(1, "At least one specification is required")
});
 
const EditProductForm = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const products = useSelector((state) => state.product.productData);
  console.log(products,"idhigo")
  const colorsData = useSelector((state) => state.color.colorData);
  const getCategoriesState = useSelector((state) => state.vendorCategory.categoryList);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setSubcategoryId] = useState("");
  const getSubCategoriesState = useSelector((state) => state.vendorSubCategory.subcategoryList);
  console.log(getSubCategoriesState)
  console.log(getSubCategoriesState,"aha aha aha")
  const color_names = (products[0]?.colornames && typeof(products[0]?.colornames)==="string")?products[0]?.colornames.split(","):[];
  const color_ids = (products[0]?.colorids && typeof(products[0]?.colorids)==="string")?products[0]?.colorids.split(","):[];
  const params = useParams();
  const colors = color_ids.map((id, index) => ({
    colorid: id,
    colorname: color_names[index],
  }));
 
 
  console.log(products.categoryId)
  useEffect(() => {
    dispatch(getColor());
  }, [dispatch]);
 
  useEffect(() => {
    dispatch(getProductById(params.slug))
  }, []);
 
  useEffect(() => {
    setCategories(getCategoriesState);
  }, [getCategoriesState]);
 
useEffect(()=>{
  if (getSubCategoriesState.length > 0) {
    setSubcategories(getSubCategoriesState);
  }
},[getSubCategoriesState])
 
 
const handleClickBlur = () => {
  dispatch(getSubCategoriesFromVendor(categoryId));
 
}
 
  const initialValues = {
    productId: products[0]?.productid,
    categoryId: products[0]?.categoryid,
    subCategoryId: products[0]?.subCategoryId,
    productName: products[0]?.productname,
    description:products[0]?.description,
    originalPrice:products[0]?.originalprice,
    currentPrice:products[0]?.currentprice,
    discount:products[0]?.discount,
    specification:products[0]?.specifications.split(",").map(spec => {
      const [name, value] = spec.split(":");
      return { name, value };
    }),
    colors: colors,
  };
 
 
  console.log(products[0]?.subcategoryid
,"em vachindhoo chudu mowa")
 
  const handleFormSubmit = (values) => {
    dispatch(updateProductById(values));
  };
 
  
  
 
  return (
    <Card sx={{ p: 6 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={handleFormSubmit}
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
        }) => {
          useEffect(() => {
            if (values.originalPrice && values.discount) {
              const discountValue = (values.originalPrice * values.discount) / 100;
              const currentPrice = values.originalPrice - discountValue;
              setFieldValue("currentPrice", Math.ceil(currentPrice));
            }
            if (values.discount === '') {
              setFieldValue("currentPrice", values.originalPrice);
            }
          }, [values.originalPrice, values.discount, setFieldValue]);
 
          return (
            <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
                  <TextField
                    select
                    fullWidth
                    color="info"
                    size="medium"
                    name="categoryId"
                    onBlur={handleClickBlur}
                    value={values.categoryId}
                    onChange={(e) => {
                      handleChange(e);
                      setSubcategoryId(e.target.value);
                    }}
                    placeholder="Parent Category"
                    label="Select Parent Category"
                    error={touched.categoryId && Boolean(errors.categoryId)}
                    helperText={touched.categoryId && errors.categoryId}
                  >
                    {categories.map((subcategory) => (
                      <MenuItem key={subcategory.categoryid} value={subcategory.categoryid}>
                        {subcategory.categoryname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
 
                <Grid item sm={6} xs={12}>
                  <TextField
                    select
                    fullWidth
                    color="info"
                    size="medium"
                    name="subCategoryId"
                    onBlur={handleBlur}
                    value={values.subCategoryId}
                    onChange={handleChange}
                    placeholder="Sub Category"
                    label="Select Sub Category"
                    error={touched.subCategoryId && Boolean(errors.subCategoryId)}
                    helperText={touched.subCategoryId && errors.subCategoryId}
                  >
                    {subcategories.map((item) => (
                      <MenuItem key={item.subcategoryid} value={item.subcategoryid}>
                        {item.subcategoryname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
 
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="productName"
                  label="Product Name"
                  color="info"
                  size="medium"
                  placeholder="Product Name"
                  value={values.productName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.productName && Boolean(errors.productName)}
                  helperText={touched.productName && errors.productName}
                />
              </Grid>
 
              <Grid item xs={12}>
                <TextField
                  rows={6}
                  multiline
                  fullWidth
                  color="info"
                  size="medium"
                  name="description"
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Description"
                  value={values.description}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
 
              <Grid item xs={12}>
                <FieldArray name="specification">
                  {({ push, remove }) => (
                    <>
                      {values.specification?.map((spec, index) => (
                        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              name={`specification.${index}.name`}
                              label="Specification Name"
                              color="info"
                              size="medium"
                              placeholder="Specification Name"
                              value={spec.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.specification?.[index]?.name && Boolean(errors.specification?.[index]?.name)}
                              helperText={touched.specification?.[index]?.name && errors.specification?.[index]?.name}
                            />
                          </Grid>
 
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              name={`specification.${index}.value`}
                              label="Specification Value"
                              color="info"
                              size="medium"
                              placeholder="Specification Value"
                              value={spec.value}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.specification?.[index]?.value && Boolean(errors.specification?.[index]?.value)}
                              helperText={touched.specification?.[index]?.value && errors.specification?.[index]?.value}
                            />
                          </Grid>
 
                          {index > 0 && (
                            <Grid item xs={2}>
                              <IconButton
                                color="secondary"
                                onClick={() => remove(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      ))}
 
                      <Button
                        color="primary"
                        onClick={() => push({ name: '', value: '' })}
                        startIcon={<AddIcon />}
                      >
                        Add Specification
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Grid>
 
              <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="originalPrice"
                    label="Original Price"
                    color="info"
                    size="medium"
                    placeholder="Original Price"
                    value={values.originalPrice}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.originalPrice && Boolean(errors.originalPrice)}
                    helperText={touched.originalPrice && errors.originalPrice}
                  />
                </Grid>
 
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="currentPrice"
                    label="Current Price"
                    color="info"
                    size="medium"
                    placeholder="Current Price"
                    value={values.currentPrice}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.currentPrice && Boolean(errors.currentPrice)}
                    helperText={touched.currentPrice && errors.currentPrice}
                  />
                </Grid>
 
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="discount"
                    label="Discount"
                    color="info"
                    size="medium"
                    placeholder="Discount"
                    value={values.discount}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.discount && Boolean(errors.discount)}
                    helperText={touched.discount && errors.discount}
                  />
                </Grid>
 
 
              <Grid item xs={12}>
                <FieldArray name="colors">
                  {({ push, remove }) => (
                    <>
                      {values.colors.map((color, index) => (
                        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                          <Grid item xs={10}>
                            <FormControl fullWidth>
                              <InputLabel id={`colors.${index}.colorname-label`}>Color Name</InputLabel>
                              <Select
                                labelId={`colors.${index}.colorname-label`}
                                name={`colors.${index}.colorname`}
                                value={color.colorname}
                                onChange={(event) => {
                                  const selectedColor = colorsData.find(c => c.colorname === event.target.value);
                                  if (selectedColor) {
                                    // Set both colorname and colorid
                                    setFieldValue(`colors.${index}.colorname`, selectedColor.colorname);
                                    setFieldValue(`colors.${index}.colorid`, selectedColor.colorid);
                                  }
                                }}
                                onBlur={handleBlur}
                                error={touched.colors?.[index]?.colorname && Boolean(errors.colors?.[index]?.colorname)}
                                label="Color Name"
                              >
                                {colorsData.map((colorOption) => (
                                  <MenuItem key={colorOption.colorid} value={colorOption.colorname}>
                                    {colorOption.colorname}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.colors?.[index]?.colorname && errors.colors?.[index]?.colorname && (
                                <div>{errors.colors?.[index]?.colorname}</div>
                              )}
                            </FormControl>
                          </Grid>
 
                          {index > 0 && (
                            <Grid item xs={2}>
                              <IconButton
                                color="secondary"
                                onClick={() => remove(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      ))}
 
                      <Button
                        color="primary"
                        onClick={() => push({ colorid: '', colorname: '' })}
                        startIcon={<AddIcon />}
                      >
                        Add Color
                      </Button>
                    </>
                  )}
                </FieldArray>
 
              </Grid>
 
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
 
          );
        }}
      </Formik>
    </Card>
  );
};
 
export default EditProductForm;
 