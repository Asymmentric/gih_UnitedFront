const mysql=require('mysql');

const pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    database:'gih',
    user:'root',
    password:'1234'
})

module.exports=pool;

