import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { forEach } from 'lodash';
import pool from 'utils/db';
dotenv.config();
 
 
export async function POST(request) {
  try {
    const
      {
        categoryId,
        currentPrice,
        description,
        discount,
        originalPrice,
        productName,
        specification,
        subCategoryId,
        color
      } = await request.json();
 
 
    // Generate current date, time, and day
    const now = new Date();
    const addedDate = now.toISOString().split('T')[0];
    const addedTime = now.toTimeString().split(' ')[0];
    const addedDay = now.toLocaleString('en-US', { weekday: 'long' });
 
    const sql = `
      INSERT INTO products (
        categoryid, subCategoryid, productname, originalprice, currentprice,
        discount, description, specification,
        addedDate, addedTime, addedDay,status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
      RETURNING productId
    `;
 
    const inputs = [
      categoryId, subCategoryId, productName, originalPrice, currentPrice,
      discount, description, "specification",
      addedDate, addedTime, addedDay,'active'
    ];
 
    const result = await pool.query(sql, inputs);
 
    if (result.rowCount) {
      const prodId = "select * from products where addeddate=$1 and addedtime=$2 and addedday=$3";
      const resultProdId = await pool.query(prodId, [addedDate, addedTime, addedDay]);
    
 
      const baseString = "insert into specification(productid, specification_name, specification_value)";
      const spec = specification.split(";");
      let counter = 2;
      let string1 = ""; // Initialize string1 outside the loop
      let insertQuery = "";
 
      // Generate the dynamic part of the query
      for (let i = 0; i < (spec.length - 1) / 2; i++) {
        let s = "$" + counter++;
        let s1 = "$" + counter++;
        string1 += (i === 0 ? " values($1," + s + "," + s1 + ")" : ",($1," + s + "," + s1 + ")");
      }
 
      let sqlValues = []
      sqlValues[0] = resultProdId.rows[0].productid;
      for (let j of spec) {
        sqlValues.push(j);  // Correct usage of the push method
      }
      sqlValues.splice(-1, 1);
 
 
      insertQuery = baseString + string1;
 
  
      const resultSpecification = await pool.query(insertQuery, sqlValues);
      if (resultSpecification) {
        const basecolorString = "insert into productsizecolors(productid,colorid)";
        let holderCounter = 2;
        let string2 = "";
        for (let i = 0; i < color.length; i++) {
          let s = "$" + holderCounter++;
          string2 += (i === 0 ? " values($1," + s + ")" : ",($1," + s + ")");
        }
        const insertcolorquery = basecolorString + string2;
        let values = [];
        values[0] = resultProdId.rows[0].productid;
        for (let i = 0; i < color.length; i++) {
          values.push(color[i].colorid);
        }
        const resultColor = await pool.query(insertcolorquery, values);
        if (resultColor) {
          const overallRatingQuery = "INSERT INTO public.ratings (productid, overallrating, addeddate, addedtime, addedday) VALUES($1,5,$2,$3,$4)"
          const query = await pool.query(overallRatingQuery, [sqlValues[0], addedDate, addedTime, addedDay]);
        }
      }
 
    }
    return NextResponse.json({ success: true }, { status: 200 })
 
  }
  catch (error) {
    console.error('Server Error:', error);
    if (error.code === '23503') {
      return NextResponse.json({
        success: false,
        error: 'Foreign key constraint violation',
        details: 'The provided categoryId or subCategoryId does not exist in the database.'
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}
 
export async function GET() {
  try{
    const sql="SELECT p.*,c.categoryid,c.categoryname,s.subcategoryid,s.subcategoryname,p.currentprice FROM products p JOIN subcategories s ON p.subcategoryid = s.subcategoryid JOIN categories c ON s.categoryid = c.categoryid where p.status='active'";
    const result=await pool.query(sql);
    return new Response(JSON.stringify(result.rows))
}
catch(error){
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error', details: error.message }))
}
}
 
 
export async function PATCH(request) {
  try {
    const {
      categoryId,
      subCategoryId,
      originalPrice,
      currentPrice,
      discount,
      description,
      productName,
      specification,
      colors,
      productId
    } = await request.json();
 
    // Update product details in the products table
    const sql = `UPDATE public.products
                 SET productname = $1,
                     categoryid = $2,
                     subcategoryid = $3,
                     originalprice = $4,
                     currentprice = $5,
                     discount = $6,
                     description = $7
                 WHERE productid = $8`;
    const sqlValues = [productName, categoryId, subCategoryId, originalPrice, currentPrice, discount, description, productId];
    const result = await pool.query(sql, sqlValues);
 
    if (result.rowCount > 0) {
      // Delete old specifications for the product
      const deleteSpecSql = "DELETE FROM specification WHERE productid = $1";
      await pool.query(deleteSpecSql, [productId]);
 
      // Insert new specifications
      const baseSpecSql = "INSERT INTO specification(productid, specification_name, specification_value)";
      let specCounter = 2;
      let specValuesPlaceholder = "";
      for (let i = 0; i < specification.length; i++) {
        let specNamePlaceholder = "$" + specCounter++;
        let specValuePlaceholder = "$" + specCounter++;
        specValuesPlaceholder += (i === 0 ? " VALUES($1, " + specNamePlaceholder + ", " + specValuePlaceholder + ")" : ", ($1, " + specNamePlaceholder + ", " + specValuePlaceholder + ")");
      }
      const insertSpecQuery = baseSpecSql + specValuesPlaceholder;
      let specValues = [productId];
      specification.forEach(spec => {
        specValues.push(spec.name);
        specValues.push(spec.value);
      });
      const specResult = await pool.query(insertSpecQuery, specValues);
 
      if (specResult.rowCount > 0) {
        // Delete old color data for the product
        const deleteColorSql = "DELETE FROM productsizecolors WHERE productid = $1";
        await pool.query(deleteColorSql, [productId]);
 
        // Insert new color data
        const baseColorSql = "INSERT INTO productsizecolors(productid, colorid)";
        let colorCounter = 2;
        let colorValuesPlaceholder = "";
        for (let i = 0; i < colors.length; i++) {
          let colorPlaceholder = "$" + colorCounter++;
          colorValuesPlaceholder += (i === 0 ? " VALUES($1, " + colorPlaceholder + ")" : ", ($1, " + colorPlaceholder + ")");
        }
        const insertColorQuery = baseColorSql + colorValuesPlaceholder;
        let colorValues = [productId];
        colors.forEach(color => {
          colorValues.push(color.colorid);
        });
        await pool.query(insertColorQuery, colorValues);
      }
    }
 
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    if (error.code === '23503') {
      return NextResponse.json({
        success: false,
        error: 'Foreign key constraint violation',
        details: 'The provided categoryId or subCategoryId does not exist in the database.'
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}
 
 
export async function DELETE(request){
  const param=request.url.split("?")[1].split("=")[1];
  try{
    const result=await pool.query("update products set status='inactive' where productid=$1",[param]);
    return NextResponse.json({ success: true }, { status: 200 })
  }
  catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}