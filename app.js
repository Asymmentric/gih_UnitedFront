var shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')

const pool=require('./DB/pools')

const app=express();

app.use('/',express.static('client/generate'));
app.use(express.urlencoded({extended:false}))


let qr=qrcode.toDataURL('https://www.instagram.com/aniruddha_bagal',(err,url)=>{
    return url;
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client/generate/index.html'))
})

app.get('/generate',(req,res)=>{
    console.log(req.query.URL)
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let shortUrl=shortid.generate()
        let sql=`insert into shortUrl (full,short) values(?,?)`
        connection.query(sql,[req.query.URL,shortUrl],(error)=>{
            connection.release();
            if(error){
                console.log(error);
                res.send({"message":"Unable to generate"})
            }
        })
    })
})

app.listen(6900,()=>{
    console.log('Running')
})