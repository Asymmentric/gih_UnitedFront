const mysql=require('mysql');

const pool=mysql.createPool({
    connectionLimit:10,
    host:'sql6.freesqldatabase.com',
    database:'sql6494773',
    user:'sql6494773',
    password:'djsQPrPJfW'
})

module.exports=pool;

