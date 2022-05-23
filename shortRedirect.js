const express=require('express')


const pool=require('./DB/pools')

const app=express();

app.get('/:shortUrl',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let sql3=`select id,full from shortUrl where short=?`
        connection.query(sql3,[req.params.shortUrl],(error,results)=>{
            connection.release();
            if(error) throw error;
            else res.redirect(JSON.parse(JSON.stringify(results[0])).full)
        })
    })
})

app.listen(6901,()=>{
    console.log("RUnnin at 6901")
})