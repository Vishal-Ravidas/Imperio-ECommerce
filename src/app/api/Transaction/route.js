import dotenv from 'dotenv';
import pool from 'utils/db';
dotenv.config();

export async function POST(req){
    const {r_orderid,r_transactionid,r_signature,userid,productid,orderid}=await req.json();
    console.log("data",r_orderid,r_transactionid,r_signature,userid,productid,orderid);
    try{
        const sql=`insert into transactions(r_orderid,r_transactionid,r_signature,userid,productid,orderid) values ($1,$2,$3,$4,$5,$6)`;
        const values=[r_orderid,r_transactionid,r_signature,userid,productid,orderid];
        const result=await pool.query(sql,values);
        console.log("result",result.rowCount);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
    }
    catch(error){
        return new Response(JSON.stringify({ success: false, error: 'Server Error', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
    }
}