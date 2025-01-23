// app/api/products/route.js
import { NextResponse } from 'next/server';
import pool from '../../../utils/db';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const now = new Date();
    const addedDate = now.toISOString().split('T')[0];
    const addedTime = now.toTimeString().split(' ')[0];
    const dateObj = new Date(addedDate);
    dateObj.setDate(dateObj.getDate() + 7);
    const expectedDelivery = dateObj.toISOString().split('T')[0];
    const addedDay = now.toLocaleString('en-US', { weekday: 'long' });

    const sql = 'INSERT INTO public.main_orders DEFAULT VALUES RETURNING *';
    const ressql= await pool.query(sql);
    console.log(ressql.rows[0].moid,"main orders");

    // Insert into `inventoryy` and return the inserted rows
    const inventoryResults = await Promise.all(body.map(async (eachItem) => {
      const { cartid, productid, userid, quantity, currentprice } = eachItem;
      const sql = `
        INSERT INTO inventoryy (
          cartid, product_id, userid, quantity, selling_price,
          date, time, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'success')
        RETURNING *;
      `;
      const values = [cartid, productid, userid, quantity, currentprice, addedDate, addedTime];
      
      const result = await pool.query(sql, values);
      return result.rows[0]; // Return the first row (the inserted data)
    }));

    console.log("Inserted inventory rows:", inventoryResults);

    if (inventoryResults.length > 0) {
      // Insert into `orders` and return the inserted rows
      const orderResults = await Promise.all(body.map(async (eachItem) => {
        const { cartid, productid, userid, quantity, currentprice } = eachItem;
        const sql = `
          INSERT INTO orders (
            cartid, product_id, user_id, qty, price,
            order_date, order_time, mode_of_payment, tax, expected_delivery
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'COD', '0', $8)
          RETURNING *;
        `;
        const values = [cartid, productid, userid, quantity, currentprice, addedDate, addedTime, expectedDelivery];
        
        const result = await pool.query(sql, values);
        return result.rows[0]; // Return the first row (the inserted data)
      }));

      console.log("Inserted order rows:", orderResults);

      let main_order_result =await Promise.all(orderResults.map(async (order) => {
        const order_id = order.order_id; // Extract order_id from the inserted order
      
        const subSql = `
          INSERT INTO main_orders_sub (moid, oid)
          VALUES ($1, $2);
        `;
        
        const subValues = [ressql.rows[0].moid, order_id]; // Use the extracted order_id
      
        await pool.query(subSql, subValues); // Insert into main_orders_sub
      }));

      console.log(main_order_result,"main order");

      // Now delete from `cart`
      const cartResults = await Promise.all(body.map(async (eachItem) => {
        const { userid } = eachItem;
        const sql = `DELETE FROM cart WHERE userid = $1`;
        const values = [userid];
        const result = await pool.query(sql, values);
        return result.rowCount;
      }));

      console.log("Deleted cart rows:", cartResults);

      // Return the inserted rows as a response
      return NextResponse.json({ success: true, inventoryResults, orderResults }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in POST request:", error);  // Log the error
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}




export async function DELETE(request) {
  try{
    const userid =  request.url.split("?")[1].split("&")[0];
    const productid = request.url.split("&")[1];
    const sql = 'delete from cart where userid=$1 and productid=$2';
    const values=[userid,productid];
    console.log(values,"val");
    const result = await pool.query(sql,values);
    return NextResponse.json({ success: true }, { status: 200 });
    
  }catch(error)
  {
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}
