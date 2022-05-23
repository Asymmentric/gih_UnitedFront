const mysql=require('mysql');

const pool=mysql.createPool({
    connectionLimit:10,
    host:process.env.HOST,
    database:process.env.DB,
    user:process.env.USER,
    password:process.env.PWD
})

module.exports=pool;

